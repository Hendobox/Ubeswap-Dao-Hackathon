import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { ChakraTheme as theme } from "./utils/chakra-themes";
import { ReactComponent as UbeLogo } from "./assets/logo.svg";
import { ViewProjects } from "./views/projects";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ChakraProvider theme={theme}>
      <Container>
        <ViewProjects />
      </Container>
      {/* <div className="App">
        <div>
          <a href="https://app.ubeswap.org/" target="_blank">
            <UbeLogo height={36} width={36} />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div> */}
    </ChakraProvider>
  );
}

export default App;
