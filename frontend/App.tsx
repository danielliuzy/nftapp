import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { TextDecoder } from "text-encoding";
import { dynamicClient } from "./src/client";
import EnsRecord from "./src/EnsRecord";

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

export default function App() {
  const { wallets } = useReactiveClient(dynamicClient);

  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const subscription = Accelerometer.addListener(
      async (accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        if (acceleration > 5 && !isShaking) {
          setIsShaking(true);
          console.log("getting balance...");
          setTimeout(() => {
            console.log("endshake");
            setIsShaking(false);
          }, 500);
        }
      }
    );

    return () => subscription.remove();
  }, [isShaking]);

  return (
    <View style={styles.container}>
      <dynamicClient.reactNative.WebView />
      {wallets.userWallets.length > 0 && (
        <EnsRecord address={wallets.userWallets[0].address as `0x${string}`} />
      )}
      <Button
        title="Login/logout"
        onPress={async () => {
          console.log("show modal");
          await dynamicClient.ui.auth.show();
          console.log("showed");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
