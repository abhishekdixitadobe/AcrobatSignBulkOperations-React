import {
  TableView,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Button,
  Column
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const CSVDisplay = ({ filledSrc, handleRemoveIndividualClick }) => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const parseAllCSVs = async () => {
      let parsedData = await Promise.all(filledSrc.map(parseCSV));
      parsedData = parsedData.flat();

      parsedData = parsedData.filter(row =>
        Object.values(row).some(value => value !== "" && value != null)
      );

      setCsvData(parsedData);
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
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
        });
      });
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return [];
    }
  };

  const columns = csvData.length > 0 ? Object.keys(csvData[0]) : [];

  return (
    <div
      className={style({
        display: "flex",
        height: "full",
        flexDirection: "column"
      })}
    >
      {csvData.length > 0 ? (
        <TableView
          aria-label="File Display"
          styles={style({ width: "full", height: 192 })}
        >
          <TableHeader>
            {columns.map((column, index) => (
              <Column
                key={column}
                id={column}
                allowsResizing
                align="start"
                isRowHeader={index === 0}
              >
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </Column>
            ))}
          </TableHeader>

          <TableBody>
            {csvData.map((row, rowIndex) => (
              <Row key={rowIndex} id={rowIndex}>
                {columns.map((column) => (
                  <Cell key={`${rowIndex}-${column}`}>
                    {row[column] || "N/A"}
                  </Cell>
                ))}
              </Row>
            ))}
          </TableBody>
        </TableView>
      ) : (
        <p>No data to display</p>
      )}

      <div
        className={style({
          display: "flex",
          justifyContent: "center",
          marginTop: 8,
          width: "full"
        })}
      >
        <Button
          variant="negative"
          onPress={() => handleRemoveIndividualClick(0)}
          styles={style({ cursor: "pointer" })}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CSVDisplay;
