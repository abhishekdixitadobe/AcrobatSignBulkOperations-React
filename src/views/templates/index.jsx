import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Grid, View, Heading} from '@adobe/react-spectrum';
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const TemplatePage = () => {  
  const templates = useSelector((state) => state.templates || []);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  //let [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([2]));
  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated || false;
  const user = authState.user;
    
  const token = authState.token;

  console.log("templates in TemplatePage:", templates);

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Template Name', uid: 'name' },
    { name: 'Owner Email', uid: 'ownerEmail' },
    { name: 'Sharing Mode', uid: 'sharingMode' },
    { name: 'Status', uid: 'status' },
  ];

  const downloadFormField = async () => {
    const idsToDownload = selectedKeys === "all"
    ? agreements.map((agreement) => agreement.id)
    : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No templates selected for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-templateFormfields', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload  }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch template formfields from the server.");

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
      alert("No template selected for download.");
      return;
    }

    try {
      const zip = new JSZip();

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-templateDocument', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload  }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch template document from the server.");

          // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "templates.zip");


    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download templates documents. Please try again.");
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
        <Heading level={2}>Total Templates: {templates.length}</Heading>
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
        <TableBody items={templates}>
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
       showDownloadFormField = {true}
       downloadOnPress={async () => {
         downloadAllasZip();
       }}
       downloadFormField={async () => {
        downloadFormField();
      }}
     />
   </View>
 </Grid>
  );
};

export default TemplatePage;
