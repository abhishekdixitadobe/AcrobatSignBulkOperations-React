import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Heading } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
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
    <div
      className={style({
        display: "grid",
        gridTemplateAreas: ["content", "footer"],
        height: "full",
        width: "full",
        gridTemplateColumns: ["1fr"],
        gridTemplateRows: ["1fr", "auto"],
        marginTop: 16
      })}>
      <div
        className={style({
          gridArea: "content",
          width: "[75%]",
          marginX: "[auto]",
          overflow: "auto"
        })}>
        <Heading level={2}>Total Agreements: {flattenedAgreements.length}</Heading>
        <TableView
          selectionMode="multiple"
          aria-label="Agreements Table"
          gap="12"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          styles={style({
            height: 480,
            width: "full"
          })}>
          <TableHeader columns={columns}>
            {(column) => (
              <Column
                id={column.uid}
                align="start"
                isRowHeader={column.uid === "id"}   // ✅ FIX
              >
                {column.name}
              </Column>
            )}
          </TableHeader>

          <TableBody items={flattenedAgreements}>
            {(item) => (
              <Row id={item.id} columns={columns}>
                <Cell>{item.id || "N/A"}</Cell>
                <Cell>{item.name || "N/A"}</Cell>
                <Cell>{item.status || "N/A"}</Cell>
                <Cell>{item.email || "N/A"}</Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </div>
      <div
        className={style({
          gridArea: "footer",
          width: "full",
          height: 80
        })}>
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
      </div>
    </div>
  );
};

export default AgreementsPage;
