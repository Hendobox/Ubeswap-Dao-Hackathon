import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ChakraTheme as theme } from "./utils/chakra-themes";
import { CreateProjectView } from "./views/create-project";
import { ViewProjects } from "./views/projects";

const { provider, chains } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider({ apiKey: "Hn0NhmSTQ5iy7VIWbmlo50i8TaLbVjFw" })]
);

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
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <ChakraProvider theme={theme}>
          <Container style={{ maxWidth: 800, height: "100vh" }}>
            <Routes>
              <Route path="/" element={<ViewProjects />} />
              <Route path="/create-project" element={<CreateProjectView />} />
              <Route path="/manage-project" element={<Box>Coming Soon!</Box>} />
            </Routes>
          </Container>
        </ChakraProvider>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
