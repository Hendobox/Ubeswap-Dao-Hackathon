import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { Project, Projects } from "../utils/projects";

export const ViewProjects = () => {
  const { connector, address } = useAccount();
  const { connect, connectors } = useConnect({
    connector: new MetaMaskConnector(),
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
  console.log({ connectors, address });
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
