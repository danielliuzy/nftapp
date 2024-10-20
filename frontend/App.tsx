import { useReactiveClient } from "@dynamic-labs/react-hooks";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextDecoder } from "text-encoding";
import { dynamicClient } from "./src/client";
import HomeScreen from "./src/HomeScreen";

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

export default function App() {
  const { wallets } = useReactiveClient(dynamicClient);
  return (
    <SafeAreaView style={styles.container}>
      <dynamicClient.reactNative.WebView />
      {wallets.userWallets.length > 0 ? (
        <HomeScreen />
      ) : (
        <>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              height: "60%",
              paddingBottom: 120,
            }}
          >
            <Image
              source={require("./assets/nftap.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dynamicClient.ui.auth.show()}
          >
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F9E7A2",
  },
  text: {
    textAlign: "center",
    color: "#645e4e",
    fontSize: 28,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 64,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff9e8",
    borderColor: "#645e4e",
    borderWidth: 4,
    marginBottom: 200,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
