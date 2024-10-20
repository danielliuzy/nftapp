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
            <Text style={styles.text}>Sign In with </Text>
            <Image
              style={{ marginTop: 12 }}
              source={{
                uri: "https://cdn.discordapp.com/attachments/727516060487516170/1297537608641155133/image.png?ex=67164990&is=6714f810&hm=ef422292bba4256b6e4ab3f1f58d4397d4f8c0f4bdb8e53609cf13a3b023fd8b&",
              }}
              width={1176 / 6}
              height={208 / 6}
            />
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
    backgroundColor: "#fff",
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
