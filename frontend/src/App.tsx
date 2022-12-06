import { ChakraProvider, Container } from "@chakra-ui/react";
import React from "react";
import {
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "./App.css";
import { ChakraTheme as theme } from "./utils/chakra-themes";
import { ViewProjects } from "./views/projects";

const { provider, chains } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "Hn0NhmSTQ5iy7VIWbmlo50i8TaLbVjFw" }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: { qrcode: true } }),
  ],
  provider,
});

// const ethereumClient = new EthereumClient(wagmiClient, defaultChains);

function App() {
  return (
    <React.Fragment>
      <WagmiConfig client={wagmiClient}>
        <ChakraProvider theme={theme}>
          <Container>
            <ViewProjects />
          </Container>
        </ChakraProvider>
      </WagmiConfig>
      {/* <Web3Modal
        projectId="<YOUR_PROJECT_ID>"
        ethereumClient={ethereumClient}
      /> */}
    </React.Fragment>
  );
}

export default App;
