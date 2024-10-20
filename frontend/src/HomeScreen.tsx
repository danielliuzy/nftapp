import { Button, Image, Modal, Text, View } from "react-native";
import EnsRecord from "./EnsRecord";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Accelerometer } from "expo-sensors";
import { useState, useEffect } from "react";
import { dynamicClient, socketClient } from "./client";
import * as Location from "expo-location";
import PendingModal from "./PendingModal";

export default function HomeScreen() {
  const { wallets } = useReactiveClient(dynamicClient);

  const [isShaking, setIsShaking] = useState(false);
  const [appEnsName, setAppEnsName] = useState("");
  const [appEnsAvatar, setAppEnsAvatar] = useState("");

  const [pendingCreate, setPendingCreate] = useState(false);
  const [pendingEns, setPendingEns] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingAddress, setPendingAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  useEffect(() => {
    const handlePendingLocation = async (
      callback: (response: {
        id: string;
        location: Location.LocationObjectCoords;
        ens: string;
        avatar: string;
        address: string;
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
        callback({
          id: socketClient.id!,
          location: location.coords,
          ens: appEnsName,
          avatar: appEnsAvatar,
          address: wallets.userWallets[0].address,
        });
      }
    };

    socketClient.on("pending-location", handlePendingLocation);

    return () => {
      socketClient.off("pending-location", handlePendingLocation);
    };
  }, [appEnsName, appEnsAvatar, wallets]);

  useEffect(() => {
    const handleExchangeEns = async (data: {
      ens: string;
      avatar: string;
      address: string;
    }) => {
      setPendingCreate(true);
      setPendingEns(data.ens);
      setPendingAvatar(data.avatar);
      setPendingAddress(data.address);
    };

    socketClient.on("exchange-ens", handleExchangeEns);

    return () => {
      socketClient.off("exchange-ens", handleExchangeEns);
    };
  }, []);

  useEffect(() => {
    const handleMintStart = () => {
      setIsLoading(true);
    };

    socketClient.on("mint-start", handleMintStart);

    return () => {
      socketClient.off("mint-start", handleMintStart);
    };
  }, []);

  useEffect(() => {
    const handlePendingEnd = (url: string, description: string) => {
      setIsLoading(false);
      setImageUrl(url);
      setImageDescription(description);
    };

    socketClient.on("pending-end", handlePendingEnd);

    return () => {
      socketClient.off("pending-end", handlePendingEnd);
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
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              return;
            }
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            socketClient.emit(
              "shake",
              appEnsName,
              appEnsAvatar,
              wallets.userWallets[0].address,
              location.coords
            );
            setTimeout(() => {
              setIsShaking(false);
            }, 500);
          }
        }
      }
    );

    return () => subscription.remove();
  }, [isShaking, appEnsName, appEnsAvatar]);

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <View
        style={{
          width: "100%",
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View style={{ width: 60 }}>
          <Image
            source={require("../assets/nftap-logo.png")}
            style={{ height: 48, width: 48 }}
          />
        </View>
      </View>

      <EnsRecord
        setAppEnsName={setAppEnsName}
        setAppEnsAvatar={setAppEnsAvatar}
        address={wallets.userWallets[0].address as `0x${string}`}
      />
      <Modal animationType="fade" transparent visible={pendingCreate}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.75)",
          }}
        >
          <View
            style={{
              height: imageUrl.length > 0 ? "42%" : "35%",
              width: "80%",
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <PendingModal
              isLoading={isLoading}
              userEns={appEnsName}
              userAvatar={appEnsAvatar}
              pendingEns={pendingEns}
              pendingAvatar={pendingAvatar}
              imageUrl={imageUrl}
              imageDescription={imageDescription}
              onMakeMemory={async () => {
                const location = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.Balanced,
                });
                socketClient.emit(
                  "make-memory",
                  appEnsName,
                  appEnsAvatar,
                  wallets.userWallets[0].address,
                  pendingEns,
                  pendingAvatar,
                  pendingAddress,
                  location.coords
                );
                setIsLoading(true);
              }}
              onDone={() => {
                setPendingCreate(false);
                setPendingEns("");
                setPendingAvatar("");
                setPendingAddress("");
                setTimeout(() => {
                  setImageUrl("");
                  setImageDescription("");
                }, 500);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
