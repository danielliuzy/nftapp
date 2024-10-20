import { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { publicClient } from "./client";

type Props = {
  userEns: string;
  userAvatar: string;
  pendingEns: string;
  pendingAvatar: string;
  onMakeMemory: () => void;
};

export default function PendingModal({
  userEns,
  userAvatar,
  pendingEns,
  pendingAvatar,
  onMakeMemory,
}: Props) {
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: userAvatar ?? "" }}
          width={50}
          height={50}
          borderRadius={25}
        />
        <Image
          source={{ uri: pendingAvatar ?? "" }}
          width={50}
          height={50}
          borderRadius={25}
        />
      </View>
      <Text>{pendingEns} connected with you!</Text>
      <Button title="Make Memory" onPress={onMakeMemory} />
    </View>
  );
}
