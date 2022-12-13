import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TableOptions, useTable } from "react-table";

type Props<T extends object> = TableOptions<T>;

export const ProjectsTable = function <T extends object>({
  columns,
  data,
}: Props<T>) {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
    });

  return (
    <TableContainer>
      {data.length ? (
        <Table variant="striped" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((header, key) => (
                  <Th {...header.getHeaderProps()} key={key}>
                    {header.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody {...getTableBodyProps()}>
            {rows.map((row, idx) => {
              prepareRow(row);

              return (
                <Tr {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, key) => (
                    <Td {...cell.getCellProps()} key={key}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : (
        <Text mt="5" fontWeight="bold" textAlign="center" color="crimson">
          There are no project(s) to display
        </Text>
      )}
    </TableContainer>
  );
};
