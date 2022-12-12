import { Box, Button, Center, Flex, Heading, Link } from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import ABI from "../assets/contract-abi.json";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { Project, Projects } from "../utils/projects";

export const ViewProjects = () => {
  const navigate = useNavigate();
  const provider = useProvider();
  const { connector, address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI.abi,
    functionName: "setProject",
    enabled: false,
    args: [1],
    overrides: {
      value: parseEther("0.1"),
      gasLimit: parseEther("0.01"),
    },
  });
  const { chain } = useNetwork();
  // const { switchNetwork, chains } = useSwitchNetwork();
  const { write, data, isError } = useContractWrite(config);
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
  const projects = Projects;
  console.log({
    address,
    chain,
  });

  // const saveagreementToIPFS = async (model: DAOIPFSModel) => {
  //   const projectId = "2Ifc0tuPeWAQfMiGkvRdt7ZMaEk";
  //   const projectSecret = "476cd702f7d1173a081e64dda670c76a";
  //   const authorization =
  //     "Basic " +
  //     Buffer.from(projectId + ":" + projectSecret).toString("base64");

  //   const client = create({
  //     host: "ipfs.infura.io",
  //     port: 5001,
  //     protocol: "https",
  //     headers: {
  //       authorization,
  //     },
  //   });

  //   try {
  //     const { path } = await client.add(JSON.stringify(model));
  //     console.log({ path });
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

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
        <ProjectsTable columns={columns} data={projects} />
      </Box>
    </Box>
  );
};
