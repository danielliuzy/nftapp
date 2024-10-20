import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View, Text, Image } from "react-native";
import { TextDecoder } from "text-encoding";
import { dynamicClient, socketClient } from "./src/client";
import EnsRecord from "./src/EnsRecord";
import * as Location from "expo-location";
import PendingModal from "./src/PendingModal";

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

export default function App() {
  const { wallets } = useReactiveClient(dynamicClient);

  const [isShaking, setIsShaking] = useState(false);
  const [appEnsName, setAppEnsName] = useState("");
  const [appEnsAvatar, setAppEnsAvatar] = useState("");

  const [pendingCreate, setPendingCreate] = useState(false);
  const [pendingEns, setPendingEns] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");

  useEffect(() => {
    const handlePendingLocation = async (
      callback: (response: {
        id: string;
        location: Location.LocationObjectCoords;
        ens: string;
        avatar: string;
      }) => void
    ) => {
      if (appEnsName.length > 0 && appEnsAvatar.length > 0) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log(location.coords);
        console.log(callback);
        callback({
          id: socketClient.id!,
          location: location.coords,
          ens: appEnsName,
          avatar: appEnsAvatar,
        });
      }
    };

    socketClient.on("pending-location", handlePendingLocation);

    return () => {
      socketClient.off("pending-location", handlePendingLocation);
    };
  }, [appEnsName, appEnsAvatar]);

  useEffect(() => {
    const handleExchangeEns = async (data: { ens: string; avatar: string }) => {
      setPendingCreate(true);
      setPendingEns(data.ens);
      setPendingAvatar(data.avatar);
    };

    socketClient.on("exchange-ens", handleExchangeEns);

    return () => {
      socketClient.off("exchange-ens", handleExchangeEns);
    };
  }, []);

  useEffect(() => {
    const subscription = Accelerometer.addListener(
      async (accelerometerData) => {
        if (appEnsName.length > 0 && appEnsAvatar.length > 0) {
          const { x, y, z } = accelerometerData;
          const acceleration = Math.sqrt(x * x + y * y + z * z);

          if (acceleration > 5 && !isShaking) {
            setIsShaking(true);
            console.log("send location and ens to server");
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              return;
            }
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            console.log(location.coords);
            socketClient.emit(
              "shake",
              appEnsName,
              appEnsAvatar,
              location.coords
            );
            setTimeout(() => {
              console.log("endshake");
              setIsShaking(false);
            }, 500);
          }
        }
      }
    );

    return () => subscription.remove();
  }, [isShaking, appEnsName, appEnsAvatar]);

  return (
    <View style={styles.container}>
      <dynamicClient.reactNative.WebView />
      {pendingCreate && (
        <PendingModal
          userEns={appEnsName}
          userAvatar={appEnsAvatar}
          pendingEns={pendingEns}
          pendingAvatar={pendingAvatar}
          onMakeMemory={() => {
            setPendingCreate(false);
            setPendingEns("");
          }}
        />
      )}
      {wallets.userWallets.length > 0 && (
        <EnsRecord
          setAppEnsName={setAppEnsName}
          setAppEnsAvatar={setAppEnsAvatar}
          address={wallets.userWallets[0].address as `0x${string}`}
        />
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
