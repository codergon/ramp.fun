import { fraxtal, fraxtalTestnet } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

const metadata = {
  name: "Ramp.fun",
  url: "https://ramp-fun.vercel.app",
  description: "Ramp.fun - Free presale Rekt? Not on our watch!",
  icons: ["https://ramp-fun.vercel.app/app/apple-touch-icon.png"],
};

export const config = createConfig({
  chains: [fraxtal, fraxtalTestnet],
  connectors: [
    coinbaseWallet({ appName: "Create Wagmi", preference: "eoaOnly" }),
  ],
  transports: {
    [fraxtal.id]: http(),
    [fraxtalTestnet.id]: http()
  },
});

declare module "wagmi" {
  // @ts-ignore
  interface Register {
    config: typeof config;
  }
}
