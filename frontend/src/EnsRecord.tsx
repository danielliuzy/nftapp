import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { normalize } from "viem/ens";
import { dynamicClient, publicClient } from "./client";

type Props = {
  address: `0x${string}`;
  setAppEnsName: (ensName: string) => void;
  setAppEnsAvatar: (ensAvatar: string) => void;
};

export default function EnsRecord({
  address,
  setAppEnsName,
  setAppEnsAvatar,
}: Props) {
  console.log(address);
  const [ensName, setEnsName] = useState("");
  const [ensAvatar, setEnsAvatar] = useState("");
  const [ensDescription, setEnsDescription] = useState("");
  const [ensTwitter, setEnsTwitter] = useState("");

  useEffect(() => {
    const getEnsData = async () => {
      const name = await publicClient.getEnsName({ address });
      console.log(name);
      if (name) {
        setEnsName(normalize(name));
        setAppEnsName(normalize(name));
        const avatar = await publicClient.getEnsAvatar({ name });
        if (avatar) {
          setEnsAvatar(avatar);
          setAppEnsAvatar(avatar);
        }
        const description = await publicClient.getEnsText({
          name,
          key: "description",
        });
        console.log(description);
        if (description) {
          setEnsDescription(description);
        }
        const twitter = await publicClient.getEnsText({
          name,
          key: "com.twitter",
        });
        console.log(twitter);
        if (twitter) {
          setEnsTwitter(twitter);
        }
      }
    };
    getEnsData();
  }, [address]);

  return (
    <View style={{ position: "absolute", top: 0, left: 20 }}>
      <TouchableOpacity onPress={() => dynamicClient.ui.auth.show()}>
        <Image
          style={{ borderColor: "#b2ab99", borderWidth: 3 }}
          source={{ uri: ensAvatar ?? require("../assets/default_avatar.jpg") }}
          width={50}
          height={50}
          borderRadius={25}
        />
      </TouchableOpacity>
      {/* <Text>{ensName}</Text>
      <Text>Description: {ensDescription}</Text>
      <Text>Twitter: {ensTwitter}</Text> */}
    </View>
  );
}
