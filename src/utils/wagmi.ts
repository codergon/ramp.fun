import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const metadata = {
  name: "Ramp.fun",
  url: "https://localhost:3001",
  description: "Ramp.fun - Buy and create tokens",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
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
