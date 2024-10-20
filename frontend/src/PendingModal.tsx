import { Button, Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  userEns: string;
  userAvatar: string;
  pendingEns: string;
  pendingAvatar: string;
  isLoading: boolean;
  imageUrl: string;
  imageDescription: string;
  onMakeMemory: () => void;
  onDone: () => void;
};

export default function PendingModal({
  userEns,
  userAvatar,
  pendingEns,
  pendingAvatar,
  isLoading,
  imageUrl,
  imageDescription,
  onDone,
  onMakeMemory,
}: Props) {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {imageUrl.length > 0 ? (
        <>
          <Text
            style={{
              position: "absolute",
              top: 4,
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            Memory Made! 🥳
          </Text>
          <Image
            source={{ uri: imageUrl }}
            width={150}
            height={150}
            borderRadius={8}
          />
          {/* <Text>{imageDescription}</Text> */}
          <Text style={{ textAlign: "center", paddingVertical: 12 }}>
            {imageDescription}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", width: "50%", bottom: 0 }}
            onPress={onDone}
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
                style={{ fontSize: 16, fontWeight: "600", color: "#645e4e" }}
              >
                Done
              </Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={{
              position: "absolute",
              top: 4,
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            You tapped
          </Text>
          <Text
            style={{
              position: "absolute",
              top: 32,
              fontWeight: "700",
              fontSize: 32,
            }}
          >
            {pendingEns}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              width: "100%",
            }}
          >
            <Image
              source={{ uri: userAvatar ?? "" }}
              width={80}
              height={80}
              borderRadius={40}
            />
            <View style={{ width: 60, marginHorizontal: 12 }}>
              <Image
                source={require("../assets/nftap-logo.png")}
                style={{ height: 60, width: 60 }}
              />
            </View>
            <Image
              source={{ uri: pendingAvatar ?? "" }}
              width={80}
              height={80}
              borderRadius={40}
            />
          </View>
          <TouchableOpacity
            style={{ position: "absolute", width: "100%", bottom: 0 }}
            onPress={onMakeMemory}
          >
            <View
              style={{
                width: "100%",
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9e7a2",
                borderRadius: 30,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "600", color: "#645e4e" }}
              >
                {!isLoading ? "Make Memory 🥳" : "Creating..."}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
