import {
  TableView,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Button,
  Column,
  Flex,
} from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const CSVDisplay = ({ filledSrc, handleRemoveIndividualClick }) => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    filledSrc.forEach(parseCSV);
  }, [filledSrc]);

  const parseCSV = async (uploadedFile) => {
    const response = await fetch(uploadedFile.url);
    const file = await response.blob();

    Papa.parse(file, {
      complete: (results) => {
       setCsvData(results.data);
      },
      header: true,
    });
  };
  const columns = csvData.length > 0 ? Object.keys(csvData[0]) : [];
  return (
    <Flex height="100%" direction="column">
      {Array.isArray(csvData) && csvData.length > 0 ? (
        <TableView aria-label="File Display" width={"100%"} height="size-2400">
          <TableHeader>
            {columns.map((column) => (
              <Column align="start" allowsResizing>{column.charAt(0).toUpperCase() + column.slice(1)}</Column>
            ))}
          </TableHeader>
          <TableBody>
            {csvData.map((data) => (
              <Row>
                {columns.map((column) => (
                  <Cell>{data[column]}</Cell>
                ))}
              </Row>
            ))}
          </TableBody>
        </TableView>
      ) : (
        <p>No data to display</p>
      )}
      <Flex justifyContent="center" marginTop="size-100" width="100%">
        <Button
          variant="negative"
          onPress={() => {
            handleRemoveIndividualClick(0);
          }}
        >
          Remove
        </Button>
      </Flex>
    </Flex>
  );
};

export default CSVDisplay;
