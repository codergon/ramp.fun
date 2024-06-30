import { baseSepolia, base } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

const metadata = {
  name: "Ramp.fun",
  url: "https://ramp-fun.vercel.app",
  description: "Ramp.fun - Free presale Rekt? Not on our watch!",
  icons: ["https://ramp-fun.vercel.app/app/apple-touch-icon.png"],
};

export const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({ appName: "Create Wagmi", preference: "all" }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http()
  },
});

declare module "wagmi" {
  // @ts-ignore
  interface Register {
    config: typeof config;
  }
}
