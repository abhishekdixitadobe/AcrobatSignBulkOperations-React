import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Grid, View, Heading, ToastQueue} from '@adobe/react-spectrum';
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { setWidgetsAgreements } from "../../redux/webformAgreementsSlice";

const WidgetsPage = () => {  
  const widgets = useSelector((state) => state.widgets || []);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const authState = useSelector((state) => state.auth || {});
    
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Widget Name', uid: 'name' },
    { name: 'Widget url', uid: 'url' },
    { name: 'Status', uid: 'status' },
  ];

  const agreementList = async () => {
    const idsToDownload = selectedKeys === "all"
      ? widgets.map((widget) => widget.id)
      : Array.from(selectedKeys);
  
    if (idsToDownload.length === 0) {
      ToastQueue.negative("No widgets selected to fetch associated agreements.", { timeout: 5000 });
      return;
    }
  
    try {
      // Send selected IDs to the backend and fetch agreements
      const response = await fetch('/api/widgets-agreements', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");
  
      // Parse the JSON response
      const data = await response.json();
  
      // Extract userAgreementList
      const userAgreementList = data.userAgreementList || [];
  
      if (userAgreementList.length === 0) {
        ToastQueue.negative("No agreements found for the selected widgets.", { timeout: 5000 });
        return;
      }
      dispatch(setWidgetsAgreements(userAgreementList));
      navigate("/widgetsAgreements");
  
    } catch (error) {
      console.error("Get agreements failed:", error);
      ToastQueue.negative("Failed to fetch agreements for the selected widgets. Please try again.", { timeout: 5000 });
    }
  };
  

  const downloadAllasZip = async () => {
    const idsToDownload = selectedKeys === "all"
    ? widgets.map((agreement) => agreement.id)
    : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {     
      ToastQueue.negative("No widgets selected for download.", { timeout: 5000 });
      return;
    }

    try {
      const zip = new JSZip();

       // Filter selected widgets based on selected keys
       const selectedWidgets = widgets.filter(widget => idsToDownload.includes(widget.id));

       // Convert selected widgets to CSV format
       let csvContent = "ID,Widget Name,Widget url,Status\n";
       selectedWidgets.forEach(widget => {
         csvContent += `${widget.id},${widget.name},${widget.url},${widget.status}\n`;
       });
 
       // Add CSV content to the ZIP file
       zip.file("selected_widgets.csv", csvContent);
 
       // Generate the ZIP file and trigger download
       const blob = await zip.generateAsync({ type: "blob" });
       saveAs(blob, "selected_widgets.zip");


    } catch (error) {
      console.error("Download failed:", error);
      ToastQueue.negative("Failed to download templates documents. Please try again.", { timeout: 5000});
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
        <Heading level={2}>Total Widgets: {widgets.length}</Heading>
        <TableView 
              selectionMode="multiple"
              aria-label="Widgets Table" 
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
        <TableBody items={widgets}>
          {(item) => (
            <Row key={item.id}>
              <Cell>{item.id || "N/A"}</Cell>
              <Cell>{item.name || "N/A"}</Cell>
              <Cell>{item.url || "N/A"}</Cell>
              <Cell>{item.status || "N/A"}</Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    </View>
     <View gridArea="footer" width="100%" height={"size-1000"}>
     <Footer
       showDownload={false}
       showDownloadList={true}
       showGetAgreements={true}
       showDownloadFormField = {false}
       downloadList={async () => {
         downloadAllasZip();
       }}
       agreementList={async () => {
        agreementList();
      }}
     />
   </View>
 </Grid>
  );
};

export default WidgetsPage;
