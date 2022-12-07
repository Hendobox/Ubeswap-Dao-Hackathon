import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useAccount, useConnect, useContractRead, useProvider } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import ABI from "../assets/contract-abi.json";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { Project, Projects } from "../utils/projects";

export const ViewProjects = () => {
  const provider = useProvider();
  const { connector, address } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI.abi,
    functionName: "owner",
  });
  const columns = useMemo(
    () => [
      {
        Header: "Project name",
        accessor: ({ name }: Project) => name,
        id: "name",
      },
      {
        Header: "Milestones",
        accessor: ({ milestones }: Project) => milestones.length,
        id: "milestones",
      },
      {
        Header: "Total Amount",
        accessor: ({ totalAmount }: Project) =>
          `${totalAmount.toString().toLocaleString()} UBE`,
        id: "totalAmount",
      },
    ],
    []
  );
  const projects = Projects;
  const getContractData = useCallback(async () => {
    const count = await provider.getCode(
      "0x3Cd3D3E524d366Ffe6e5e7740F5A7162E970BBb6"
    );
    console.log({ count });
  }, []);
  console.log({
    count: data,
    codeExists: getContractData(),
    address,
  });
  return (
    <Container minH="100vh">
      <Flex alignItems="center" justifyContent="space-between">
        <Center>
          <Link href="https://app.ubeswap.org/" target="_blank">
            <UbeLogo height={36} width={36} />
          </Link>
        </Center>

        <Button
          onClick={() => connect({ connector })}
          // disabled={!connector?.ready}
        >
          Connect Wallet
        </Button>
      </Flex>

      <Center mt={4}>
        <Heading>UBE DAO Projects Funding</Heading>
      </Center>

      <Box mt={4}>
        <ProjectsTable columns={columns} data={projects} />
      </Box>
    </Container>
  );
};
