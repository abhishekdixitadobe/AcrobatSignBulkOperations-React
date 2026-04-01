import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Grid,
  View,
  Heading,
} from "@adobe/react-spectrum";
import Footer from "../../components/footer";
import { downloadFilesAsZip, downloadList } from "../../services/apiService";
const AgreementsPage = () => {
  const { agreementAssetsResults } = useSelector((state) => state.agreements);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const authState = useSelector((state) => state.auth || {});
  const token = authState.token;

  // Flatten the grouped results into an array
  const flattenedAgreements = Object.entries(agreementAssetsResults || {}).flatMap(([email, result]) =>
    (result.agreementAssetsResults || []).map((agreement) => ({
      ...agreement,
      email, // Add email to each agreement
    }))
  );

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Agreement Name", uid: "name" },
    { name: "Status", uid: "status" },
    { name: "Email", uid: "email" },
  ];

  const handleDownloadList = async (fileName) => {
    const selectedRows =
      selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((agreement) => selectedKeys.has(agreement.id));

    const idsToDownload = selectedRows.map((row) => row.id);
    const emailsToDownload = selectedRows.map((row) => row.email);

    await downloadList(idsToDownload, flattenedAgreements, fileName, emailsToDownload);
  };

  const handleDownload = async (endpoint, fileName) => {
    const selectedRows =
    selectedKeys === "all"
      ? flattenedAgreements
      : flattenedAgreements.filter((agreement) => selectedKeys.has(agreement.id));

    const agreementsToDownload = selectedRows.map((row) => ({
      id: row.id,
      email: row.email,
    }));


    await downloadFilesAsZip(endpoint, agreementsToDownload, token, fileName, flattenedAgreements);
  };

  const showDeleteButton = process.env.REACT_APP_SHOW_DELETE === "true";

  return (
    <Grid
      areas={["content", "footer"]}
      height="100%"
      width="100%"
      columns={["1fr"]}
      rows={["1fr", "auto"]}
      marginTop={"size-200"}
    >
      <View gridArea="content" width="75%" marginX="auto" overflow="auto">
        <Heading level={2}>Total Agreements: {flattenedAgreements.length}</Heading>
        <TableView
          selectionMode="multiple"
          aria-label="Agreements Table"
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
                <Cell>{item.status || "N/A"}</Cell>
                <Cell>{item.email || "N/A"}</Cell>
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
          showAuditReport={true}
          showDelete={showDeleteButton}
          downloadList={async () => {
            handleDownloadList("agreementsList.zip");
          }}
          downloadOnPress={async () =>
            handleDownload("/api/download-agreements", "agreements.zip")
          }
          downloadFormField={async () =>
            handleDownload("/api/download-formfields", "formfields.zip")
          }
          downloadAuditReport={async () =>
            handleDownload("/api/download-auditReport", "auditReports.zip")
          }
        />
      </View>
    </Grid>
  );
};

export default AgreementsPage;