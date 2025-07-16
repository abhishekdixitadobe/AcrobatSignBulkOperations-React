import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Grid, View, Heading } from "@adobe/react-spectrum";
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { downloadFilesAsZip, downloadList } from "../../services/apiService";
const TemplatePage = () => {
  const agreementAssetsResults = useSelector((state) => state.templates || []);
  const columns = [
    { name: "ID", uid: "id" },
    { name: "Template Name", uid: "name" },
    { name: "Owner Email", uid: "ownerEmail" },
    { name: "Sharing Mode", uid: "sharingMode" },
    { name: "Status", uid: "status" },
  ];
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const authState = useSelector((state) => state.auth || {});
  const token = authState.token;

  // Flatten the grouped results into an array
  const templateAssetsResults =
    agreementAssetsResults.templateAssetsResults || {};

  const flattenedAgreements = Object.entries(templateAssetsResults).flatMap(
    ([email, result]) =>
      (result.libraryDocuments || []).map((doc) => ({
        ...doc,
        email, // append the email
      }))
  );

  const handleDownloadList = async (fileName) => {
    const selectedRows =
      selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((libraryDocument) =>
            selectedKeys.has(libraryDocument.id)
          );

    const idsToDownload = selectedRows.map((row) => row.id);
    const emailsToDownload = selectedRows.map((row) => row.email);

    await downloadList(idsToDownload, flattenedAgreements, fileName, emailsToDownload);
  };

  const handleDownload = async (endpoint, fileName) => {
    const selectedRows = selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((libraryDocument) =>
            selectedKeys.has(libraryDocument.id)
          );

    const agreementsToDownload = selectedRows.map((row) => ({
      id: row.id,
      email: row.email,
    }));

    await downloadFilesAsZip(endpoint, agreementsToDownload, token, fileName, flattenedAgreements);
  };

  return (
    <Grid
      areas={["content", "footer"]}
      height="100%" // Subtract the height of the footer
      width="100%"
      columns={["1fr"]}
      rows={["1fr", "auto"]}
      marginTop={"size-200"}
    >
      <View gridArea="content" width="75%" marginX="auto" overflow="auto">
        <Heading level={2}>Total Templates: {flattenedAgreements.length}</Heading>
        <TableView
          selectionMode="multiple"
          aria-label="Template Table"
          height="size-6000"
          gap="size-150"
          width="100%"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <Column key={column.uid} align="start">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={flattenedAgreements}>
            {(item) => (
              <Row key={item.id}>
                <Cell>{item.id || "N/A"}</Cell>
                <Cell>{item.name || "N/A"}</Cell>
                <Cell>{item.ownerEmail || "N/A"}</Cell>
                <Cell>{item.sharingMode || "N/A"}</Cell>
                <Cell>{item.status || "N/A"}</Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </View>
      <View gridArea="footer" width="100%" height={"size-1000"}>
        <Footer
          showDownload={true}
          showDownloadList={true}
          showDownloadFormField={true}
          downloadList={async () => {
            handleDownloadList("templates.zip");
          }}
          downloadOnPress={async () =>
            handleDownload("/api/download-templateDocument", "templates.zip")
          }
          downloadFormField={async () =>
            handleDownload("/api/download-templateFormfields", "formfields.zip")
          }
        />
      </View>
    </Grid>
  );
};

export default TemplatePage;
