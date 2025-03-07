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
    const parseAllCSVs = async () => {
      const parsedData = await Promise.all(filledSrc.map(parseCSV));
      setCsvData(parsedData.flat()); // Merge all data into one array
    };

    parseAllCSVs();
  }, [filledSrc]);

  const parseCSV = async (uploadedFile) => {
    try {
      const response = await fetch(uploadedFile.url);
      const file = await response.blob();

      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data);
          },
        });
      });
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return [];
    }
  };

  const columns = csvData.length > 0 ? Object.keys(csvData[0]) : [];

  return (
    <Flex height="100%" direction="column">
      {Array.isArray(csvData) && csvData.length > 0 ? (
        <TableView aria-label="File Display" width="100%" height="size-2400">
          <TableHeader>
            {columns.map((column) => (
              <Column
                key={column}
                align="start"
                allowsResizing
              >
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </Column>
            ))}
          </TableHeader>
          <TableBody>
            {csvData.map((data, rowIndex) => (
              <Row key={rowIndex}>
                {columns.map((column) => (
                  <Cell key={`${rowIndex}-${column}`}>
                    {data[column] || "N/A"}
                  </Cell>
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
