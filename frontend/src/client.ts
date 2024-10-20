import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { io } from "socket.io-client";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const dynamicClient = createClient({
  environmentId: process.env.EXPO_PUBLIC_ENVIRONMENT_ID as string,

  // Optional:
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "NFTap",
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension());

export const publicViemClient = dynamicClient.viem.createPublicClient({
  chain: mainnet,
});

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const socketClient = io("http://10.71.3.22:3000");
