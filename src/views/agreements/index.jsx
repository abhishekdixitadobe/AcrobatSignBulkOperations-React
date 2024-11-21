import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Grid, View, Heading} from '@adobe/react-spectrum';
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const AgreementsPage = () => {  
  const agreements = useSelector((state) => state.agreements || []);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  //let [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([2]));
  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated || false;
  const user = authState.user;
    
  const token = authState.token;

  console.log("Agreements in AgreementsPage:", agreements);

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Agreement Name', uid: 'name' },
    { name: 'Status', uid: 'status' },
  ];

  const downloadAuditReport = async () => {
    const idsToDownload = selectedKeys === "all"
    ? agreements.map((agreement) => agreement.id)
    : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No agreements selected for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-auditReport', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload  }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");

          // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "auditReports.zip");


    } catch (error) {
      console.error("Download Audit reports failed:", error);
      alert("Failed to download audit reports. Please try again.");
    }
  };

  const downloadFormField = async () => {
    const idsToDownload = selectedKeys === "all"
    ? agreements.map((agreement) => agreement.id)
    : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No agreements selected for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-formfields', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload  }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");

          // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "formfields.zip");


    } catch (error) {
      console.error("Download Form fields failed:", error);
      alert("Failed to download form fields. Please try again.");
    }
  };

  const downloadAllasZip = async () => {
    const idsToDownload = selectedKeys === "all"
    ? agreements.map((agreement) => agreement.id)
    : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No agreements selected for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-agreements', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload  }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");

          // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "agreements.zip");


    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download agreements. Please try again.");
    }
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
        <Heading level={2}>Total Agreements: {agreements.length}</Heading>
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
        <TableBody items={agreements}>
          {(item) => (
            <Row key={item.id}>
              <Cell>{item.id || "N/A"}</Cell>
              <Cell>{item.name || "N/A"}</Cell>
              <Cell>{item.status || "N/A"}</Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    </View>
     <View gridArea="footer" width="100%" height={"size-1000"}>
     <Footer
       showDownload={true}
       showDownloadFormField = {true}
       showAuditReport = {true}
       downloadOnPress={async () => {
         downloadAllasZip();
       }}
       downloadFormField={async () => {
        downloadFormField();
      }}
      downloadAuditReport={async () => {
        downloadAuditReport();
      }}
     />
   </View>
 </Grid>
  );
};

export default AgreementsPage;
