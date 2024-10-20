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
  const [ensName, setEnsName] = useState("");
  const [ensAvatar, setEnsAvatar] = useState("");

  useEffect(() => {
    const getEnsData = async () => {
      const name = await publicClient.getEnsName({ address });
      if (name) {
        setEnsName(normalize(name));
        setAppEnsName(normalize(name));
        const avatar = await publicClient.getEnsAvatar({ name });
        if (avatar) {
          setEnsAvatar(avatar);
          setAppEnsAvatar(avatar);
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
          source={{
            uri:
              ensAvatar.length > 0
                ? ensAvatar
                : "https://cdn.discordapp.com/attachments/727516060487516170/1297541115095814154/ethereum-name-service-ens-logo-9190A647F5-seeklogo.png?ex=67164cd4&is=6714fb54&hm=baa70750419f58f0bb55a3b9f10d008a26fda44a017970263a47bca4574f1ff5&",
          }}
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
