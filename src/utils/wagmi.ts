import { fraxtal, fraxtalTestnet } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const metadata = {
  name: "Ramp.fun",
  url: "https://ramp-fun.vercel.app",
  description: "Ramp.fun - Free presale Rekt? Not on our watch!",
  icons: ["https://ramp-fun.vercel.app/app/apple-touch-icon.png"],
};

export const config = createConfig({
  chains: [fraxtal, fraxtalTestnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Ramp.fun", preference: "eoaOnly" }),
    walletConnect({
      metadata,
      showQrModal: false,
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
    }),
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
