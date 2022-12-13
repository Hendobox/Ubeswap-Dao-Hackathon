import { Box, Button, Center, Flex, Heading, Link } from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { Project } from "../utils/projects";

export const ViewProjects = () => {
  const navigate = useNavigate();
  const { connector, address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
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
      {
        Header: "Action",
        accessor: () => <Button>View</Button>,
      },
    ],
    []
  );
  console.log({
    address,
    chain,
  });

  return (
    <Box minH="100vh" p="4">
      <Flex alignItems="center" justifyContent="space-between">
        <Center>
          <Link href="https://app.ubeswap.org/" target="_blank">
            <UbeLogo height={36} width={36} />
          </Link>
        </Center>

        <Button
          onClick={() => (isConnected ? disconnect() : connect({ connector }))}
        >
          {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </Flex>

      <Center mt={4}>
        <Heading>UBE DAO Projects Funding</Heading>
      </Center>

      <Button mt={3} onClick={() => navigate("/create-project")}>
        Create new Project
      </Button>

      <Box mt={4}>
        <ProjectsTable columns={columns} data={[]} />
      </Box>
    </Box>
  );
};
