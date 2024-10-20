import { useReactiveClient } from "@dynamic-labs/react-hooks";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dynamicClient, publicClient, socketClient } from "./client";
import EnsRecord from "./EnsRecord";
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

  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [nftOwner, setNftOwner] = useState("");
  const [nftEns, setNftEns] = useState("");

  const [tokenMetadata, setTokenMetadata] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (nftOwner && nftOwner.length > 0) {
        const name = await publicClient.getEnsName({
          address: nftOwner as `0x${string}`,
        });
        if (name) {
          setNftEns(name);
        }
      } else {
        setNftEns("");
      }
    })();
  }, [nftOwner]);

  useEffect(() => {
    const handleTokenMetadata = (metadata: any[]) => {
      setTokenMetadata(
        metadata.filter(({ metadata: m }) => {
          return m != null;
        })
      );
    };
    socketClient.on("token-metadata", handleTokenMetadata);
    socketClient.emit("fetch-tokens");

    return () => {
      socketClient.off("token-metadata", handleTokenMetadata);
    };
  }, []);

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
              accuracy: Location.Accuracy.Lowest,
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
      <View style={{ flex: 1, marginTop: 24 }}>
        <FlatList
          style={{ height: "100%", width: "100%" }}
          data={tokenMetadata}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "gray" }}></View>
          )}
          renderItem={({ item }) => {
            const { name, description, image } = JSON.parse(item.metadata);
            return (
              <Pressable
                onPress={() => {
                  setNftName(name);
                  setNftDescription(description);
                  setNftImage(image);
                  setNftOwner(item.owner_of);
                }}
              >
                <View
                  style={{
                    height: 100,
                    flexDirection: "row",
                    backgroundColor: "white",
                    padding: 8,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 24,
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      height={80}
                      width={80}
                      borderRadius={8}
                    />
                  </View>
                  <View
                    style={{
                      width: "70%",
                      height: "100%",
                      justifyContent: "center",
                      marginLeft: 16,
                    }}
                  >
                    <Text
                      style={{ fontWeight: "600", fontSize: 16, width: "80%" }}
                    >
                      {name}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => Linking.openURL("https://polygon.technology")}
        >
          <Image
            source={{
              uri: "https://cdn.discordapp.com/attachments/727516060487516170/1297536319152590889/powered-by-polygon.png?ex=6716485d&is=6714f6dd&hm=71bd77c827ff4d34479930cdaa7ec746f14b81cffdba2952063c1068fe7cce13&",
            }}
            width={728 / 3}
            height={136 / 3}
          />
        </Pressable>
      </View>

      <View
        style={{
          position: "absolute",
          top: 10,
          right: 20,
        }}
      >
        <TouchableOpacity onPress={() => socketClient.emit("fetch-tokens")}>
          <Image
            source={{
              uri: "https://www.iconpacks.net/icons/2/free-refresh-icon-3104-thumb.png",
            }}
            width={30}
            height={30}
            borderRadius={25}
          />
        </TouchableOpacity>
      </View>
      <EnsRecord
        setAppEnsName={setAppEnsName}
        setAppEnsAvatar={setAppEnsAvatar}
        address={wallets.userWallets[0].address as `0x${string}`}
      />
      <Modal
        animationType="fade"
        transparent
        visible={pendingCreate || nftDescription.length > 0}
      >
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
              height:
                imageUrl.length > 0
                  ? "42%"
                  : nftDescription.length > 0
                  ? "50%"
                  : "35%",
              width: "80%",
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            {nftDescription.length === 0 ? (
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
            ) : (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    top: 4,
                    fontWeight: "600",
                    fontSize: 18,
                  }}
                >
                  {nftName}
                </Text>
                <Image
                  source={{ uri: nftImage }}
                  width={150}
                  height={150}
                  borderRadius={8}
                />
                <Text style={{ textAlign: "center", paddingVertical: 12 }}>
                  {nftDescription}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (nftEns) {
                      Linking.openURL(`https://app.ens.domains/${nftEns}`);
                    }
                  }}
                >
                  <Image
                    source={{
                      uri: "https://cdn.discordapp.com/attachments/727516060487516170/1297533949907832862/ethereum-name-service-ens-logo.png?ex=67164628&is=6714f4a8&hm=3cc71daccd0740a5b5a1779e11d1f94c58f55c4c27ef4f1b903d3d503ac23b39&",
                    }}
                    height={20}
                    width={20}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      marginLeft: 4,
                      fontWeight: "500",
                    }}
                  >
                    {nftEns.length > 0 ? nftEns : "Loading ENS..."}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ position: "absolute", width: "50%", bottom: 0 }}
                  onPress={() => {
                    setNftName("");
                    setNftDescription("");
                    setNftImage("");
                    setNftOwner("");
                    setNftEns("");
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f9e7a2",
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#645e4e",
                      }}
                    >
                      Done
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
