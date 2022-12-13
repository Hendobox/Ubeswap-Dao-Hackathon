import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Buffer } from "buffer";
import { parseEther } from "ethers/lib/utils.js";
import { useFormik } from "formik";
import { create } from "ipfs-http-client";
import { useState } from "react";
import * as Yup from "yup";
import { DAOIPFSModel } from "../types";

const ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email Provided")
    .required("Please provide an email address"),
  beneficiaryName: Yup.string()
    .min(2, "Invalid name")
    .max(25, "Invalid name")
    .required("Please provide beneficiary name"),
  projectName: Yup.string()
    .min(2, "Invalid project name")
    .max(25, "Invalid project name")
    .required("Please provide project name"),
  beneficiaryWalletAddress: Yup.string()
    .min(30, "Address is too short")
    .max(68, "Address is too long")
    .required("Waller address must be provided"),
});

export const CreateProjectView = () => {
  const [projectData, setProjectData] = useState<null | any>(null);
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    errors,
  } = useFormik({
    initialValues: {
      email: "",
      beneficiaryName: "",
      projectName: "",
      beneficiaryWalletAddress: "",
      milestones: [{ timestamp: "", amount: "" }],
    },
    validationSchema: ValidationSchema,
    onSubmit: async (model) => {
      console.log({ model });
      const projectId = "2Ifc0tuPeWAQfMiGkvRdt7ZMaEk";
      const projectSecret = "476cd702f7d1173a081e64dda670c76a";
      const authorization =
        "Basic " +
        Buffer.from(projectId + ":" + projectSecret).toString("base64");

      const client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization,
        },
      });

      const agreementData: Omit<DAOIPFSModel, "title"> = {
        email: model.email,
        beneficiaryWalletAddress: model.beneficiaryWalletAddress,
        projectName: model.projectName,
        beneficiaryName: model.beneficiaryName,
      };

      try {
        const { path } = await client.add(JSON.stringify(agreementData));

        const structuresMilestones = values.milestones
          .map(({ timestamp, amount }) => ({
            closed: false,
            approved: false,
            timestamp: new Date(timestamp).getTime() * 1000,
            amount: parseEther(amount.toString()),
          }))
          .sort(({ timestamp: tA }, { timestamp: tB }) => (tB > tA ? -1 : 1));

        const projectData = [
          values.beneficiaryWalletAddress,
          structuresMilestones,
          path,
        ];
        console.log({ projectData });
        setProjectData(projectData);
      } catch (error) {
        console.log({ error });
      }
    },
  });

  console.log({ values, errors });
  return (
    <Container maxW="800px" minH="100%">
      <Flex justifyContent={"center"} alignItems="center" height="100vh">
        <Box>
          <Heading textAlign="center" mb="40px">
            Provide Project Information to Create One
          </Heading>
          <form onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  isInvalid={!!errors.email}
                  value={values.email}
                  errorBorderColor="crimson"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Beneficiary Name</FormLabel>
                <Input
                  type="text"
                  name="beneficiaryName"
                  onChange={handleChange}
                  value={values.beneficiaryName}
                  isInvalid={!!errors.beneficiaryName}
                  errorBorderColor="crimson"
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input
                  type="text"
                  name="projectName"
                  isInvalid={!!errors.projectName}
                  value={values.projectName}
                  errorBorderColor="crimson"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl position="relative">
                <FormLabel>Wallet Address</FormLabel>
                <Input
                  type="text"
                  name="beneficiaryWalletAddress"
                  placeholder="0x..."
                  isInvalid={!!errors.beneficiaryWalletAddress}
                  errorBorderColor="crimson"
                  onChange={handleChange}
                  value={values.beneficiaryWalletAddress}
                  onBlur={handleBlur}
                />
                <Button
                  background="none"
                  style={{ position: "absolute", right: "0%" }}
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setFieldValue("beneficiaryWalletAddress", text);
                  }}
                >
                  Paste
                </Button>
              </FormControl>
            </Grid>

            <Box mt="7">
              <Button
                onClick={() =>
                  setFieldValue("milestones", [
                    ...values.milestones,
                    { timestamp: "", amount: "" },
                  ])
                }
                borderRadius={10}
                style={{
                  display: "flex",
                  margin: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  padding: "5px 20px",
                }}
              >
                Add Milestones
                <AddIcon />
              </Button>
            </Box>
            <Flex w="100%" mt="20px" gap="5" direction="column">
              {values.milestones.length
                ? values.milestones.map((milestone, index) => (
                    <Flex
                      gap="20px"
                      width="100%"
                      alignItems="flex-end"
                      justifyContent="space-between"
                      key={index}
                    >
                      <FormControl style={{ flex: "1" }}>
                        <FormLabel>Amount</FormLabel>
                        <Input
                          type="number"
                          placeholder="Amount in CELO"
                          name={`milestones.${index}.amount`}
                          onChange={({ target }) =>
                            setFieldValue(
                              `milestones.${index}.amount`,
                              target.value
                            )
                          }
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel>Payout Time</FormLabel>
                        <Input
                          type="datetime-local"
                          name={`milestones.${index}.timestamp`}
                          placeholder="0x..."
                          onChange={({ target }) =>
                            setFieldValue(
                              `milestones.${index}.timestamp`,
                              target.value
                            )
                          }
                        />
                      </FormControl>

                      <Button
                        onClick={() => {
                          const filteredMilestones = values.milestones.filter(
                            (_, id) => id !== index
                          );
                          setFieldValue("milestones", filteredMilestones);
                        }}
                        _hover={{
                          background: "none",
                          border: "none",
                        }}
                        background="none"
                      >
                        <CloseIcon />
                      </Button>
                    </Flex>
                  ))
                : null}
            </Flex>

            {projectData?.[2] ? (
              <Box mt="5">
                <Text>Agreement Data saved to IPFS: {projectData[2]}</Text>
              </Box>
            ) : null}

            {values.milestones.length && !projectData ? (
              <Flex alignItems="center" justifyContent="center">
                {projectData ? (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(projectData)
                      );
                    }}
                    mt="5"
                  >
                    Copy Multisig Transaction Params
                  </Button>
                ) : (
                  <Button flex="1" maxW="15em" mt="40px" type="submit">
                    {isSubmitting ? <Spinner /> : "Pin to IPFS"}
                  </Button>
                )}
              </Flex>
            ) : null}
          </form>
        </Box>
      </Flex>
    </Container>
  );
};
