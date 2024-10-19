import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";

export const dynamicClient = createClient({
  environmentId: process.env.EXPO_PUBLIC_ENVIRONMENT_ID as string,

  // Optional:
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "NFTap",
}).extend(ReactNativeExtension());
