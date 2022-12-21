import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ABI from "../assets/contract-abi.json";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { InjectedConnector } from "wagmi/connectors/injected";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { Project } from "../utils/projects";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContributorAgreementForm } from "./agreement-doc";

export const ViewProjects = () => {
  const navigate = useNavigate();
  const [currentID, setID] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const { address, isConnected } = useAccount();
  useConnect({
    connector: new MetaMaskConnector(),
  });
  // const { disconnect } = useDisconnect();
  const columns = useMemo(
    () => [
      {
        Header: "Milestones",
        accessor: ({ milestones }: Project) => milestones.length,
        id: "milestones",
      },
      {
        Header: "Total Amount (UBE)",
        accessor: ({ totalAmount }: Project) =>
          `${formatEther(BigNumber.from(totalAmount).toNumber())}`,
        id: "totalAmount",
      },
      {
        Header: "Action",
        Cell: ({ row }: any) => (
          <Button
            onClick={() => {
              setID(row.index);
              onOpen();
            }}
          >
            View
          </Button>
        ),
      },
    ],
    []
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryBlockchainProjects = useCallback(async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    );
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider);
    const BNcount = await contract.count();
    const count = BigNumber.from(BNcount).toNumber();

    const projectArray = [];

    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        const project = await contract.getProject(i);
        projectArray.push(project);
      }

      setProjects(projectArray);
    }
  }, []);

  useEffect(() => {
    if (isConnected && !!address) {
      queryBlockchainProjects();
    }
  }, [isConnected, address]);

  return (
    <React.Fragment>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {projects.length ? (
          <ModalContent>
            <ModalHeader>Project {currentID + 1}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid gap="3">
                <Flex>
                  <Text fontWeight="bold">Has Started:&nbsp;</Text>
                  <Text>{projects[currentID][0] ? "True" : "False"}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Is Approved:&nbsp;</Text>
                  <Text>{projects[currentID][1] ? "True" : "False"}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Total Amount:&nbsp;</Text>
                  <Text>{formatEther(projects[currentID][3])}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Total Payout:&nbsp;</Text>
                  <Text>{formatEther(projects[currentID][5])}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Total Missout:&nbsp;</Text>
                  <Text>{formatEther(projects[currentID][4])}</Text>
                </Flex>
                <Box>
                  <Text fontWeight="bold">Milestones:&nbsp;</Text>
                  <OrderedList style={{ listStyle: "initial" }}>
                    {projects[currentID][2].map(
                      (
                        [closed, approved, timestamp, amount]: [
                          boolean,
                          boolean,
                          BigNumber,
                          BigNumber
                        ],
                        index: number
                      ) => (
                        <ListItem
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            listStyle: "initial",
                            // alignItems: "center",
                            backgroundColor: "#eaeaea",
                            padding: "10px",
                            borderRadius: "10px",
                            gap: "10px",
                            marginTop: "20px",
                          }}
                          key={index}
                        >
                          <Flex>
                            <Text fontWeight="bold">Closed:&nbsp;</Text>
                            <Text>{closed ? "True" : "False"}</Text>
                          </Flex>

                          <Flex>
                            <Text fontWeight="bold">Approved:&nbsp;</Text>
                            <Text>{approved ? "True" : "False"}</Text>
                          </Flex>

                          <Flex>
                            <Text fontWeight="bold">Amount:&nbsp;</Text>
                            <Text>{formatEther(amount)}</Text>
                          </Flex>

                          <Flex>
                            <Text fontWeight="bold">Timestamp:&nbsp;</Text>
                            <Text>
                              {new Date(
                                BigNumber.from(timestamp).toNumber() / 1000
                              ).toUTCString()}
                            </Text>
                          </Flex>
                        </ListItem>
                      )
                    )}
                  </OrderedList>

                  <Box mb="5" mt="6" textAlign="center">
                    <PDFDownloadLink
                      document={
                        <ContributorAgreementForm
                          dao={{
                            milestoneContract:
                              "0x0000000000000000000000000000000000000000",
                            discord: "https://discord.com/invite/VHUZjJ8s",
                            email: "https://discord.com/invite/VHUZjJ8s",
                          }}
                          email=""
                          walletAddress=""
                          beneficiaryName=""
                          projectName=""
                          date={new Date()}
                        />
                      }
                      fileName={`project-${currentID + 1}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          "Loading document..."
                        ) : (
                          <Button colorScheme="teal" variant="solid">
                            Download Agreement Document
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </Box>
                </Box>
              </Grid>
            </ModalBody>
          </ModalContent>
        ) : null}
      </Modal>

      <Box minH="100vh" p="4">
        <Flex alignItems="center" justifyContent="space-between">
          <Center>
            <Link href="https://app.ubeswap.org/" target="_blank">
              <UbeLogo height={36} width={36} />
            </Link>
          </Center>
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
    </React.Fragment>
  );
};
