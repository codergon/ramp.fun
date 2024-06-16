import { mainnet } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const metadata = {
  name: "Ramp.fun",
  url: "https://ramp-fun.vercel.app",
  description: "Ramp.fun - Free presale Rekt? Not on our watch!",
  icons: ["https://ramp-fun.vercel.app/app/apple-touch-icon.png"],
};

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Create Wagmi" }),
    walletConnect({
      metadata,
      showQrModal: false,
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  // @ts-ignore
  interface Register {
    config: typeof config;
  }
}
