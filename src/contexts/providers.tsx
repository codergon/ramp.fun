import App from "../App";
import { WagmiProvider } from "wagmi";
import AppProvider from "./AppProvider";
import { config } from "utils/wagmi.ts";
import ModalProvider from "./ModalProvider";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
});

export const Providers = () => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ModalProvider>
              <Router>
                <App />
              </Router>
            </ModalProvider>
          </AppProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default Providers;
