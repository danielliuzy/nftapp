import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { dynamicClient } from "./src/client";

export default function App() {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      if (acceleration > 5 && !isShaking) {
        console.log("start shake");
        setIsShaking(true);
        setTimeout(() => {
          console.log("endshake");
          setIsShaking(false);
        }, 500);
      }
    });

    return () => subscription.remove();
  }, [isShaking]);

  return (
    <View style={styles.container}>
      <dynamicClient.reactNative.WebView />
      <Button title="Show modal" onPress={() => dynamicClient.ui.auth.show()} />
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
