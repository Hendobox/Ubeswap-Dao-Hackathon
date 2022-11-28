import { Box, Center, Container, Heading, Link } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ReactComponent as UbeLogo } from "../assets/logo.svg";
import { ProjectsTable } from "../components/table";
import { Project, Projects } from "../utils/projects";

export const ViewProjects = () => {
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
  return (
    <Container minH="100vh">
      <Center>
        <Link href="https://app.ubeswap.org/" target="_blank">
          <UbeLogo height={36} width={36} />
        </Link>
      </Center>

      <Center mt={4}>
        <Heading>UBE DAO Projects Funding</Heading>
      </Center>

      <Box mt={4}>
        <ProjectsTable columns={columns} data={projects} />
      </Box>
    </Container>
  );
};
