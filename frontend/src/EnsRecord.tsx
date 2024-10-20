import { Image, View, Text } from "react-native";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName, useEnsText } from "wagmi";
import { publicClient } from "./client";
import { useEffect, useState } from "react";

type Props = {
  address: `0x${string}`;
  setAppEnsName: (ensName: string) => void;
};

export default function EnsRecord({ address, setAppEnsName }: Props) {
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
    <View>
      <Image
        source={{ uri: ensAvatar ?? "" }}
        width={50}
        height={50}
        borderRadius={25}
      />
      <Text>{ensName}</Text>
      <Text>Description: {ensDescription}</Text>
      <Text>Twitter: {ensTwitter}</Text>
    </View>
  );
}
