import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { mainnet, polygon, sepolia } from "viem/chains";
import { createPublicClient, http } from "viem";

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
