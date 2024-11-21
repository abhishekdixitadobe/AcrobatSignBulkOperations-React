import {
  TableView,
  TableHeader,
  TableBody,
  Row,
  Cell,
  ActionButton,
  Column,
  Flex,
} from "@adobe/react-spectrum";
import Close from "@spectrum-icons/workflow/Close";
import React from "react";

const FileDisplay = ({ filledSrc, handleRemoveIndividualClick }) => {
  return (
    <Flex justifyContent="center" height="100%">
      <TableView aria-label="File Display" width={"size-5000"}>
        <TableHeader>
          <Column key="filename" align="start">
            File Name
          </Column>
          <Column key="remove" maxWidth={80} />
        </TableHeader>
        <TableBody>
          {filledSrc.map((file, index) => (
            <Row key={index}>
              <Cell>{file.name}</Cell>
              <Cell>
                <ActionButton
                  onPress={() => handleRemoveIndividualClick(index)}
                  isQuiet
                >
                  <Close />
                </ActionButton>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Flex>
  );
};

export default FileDisplay;
