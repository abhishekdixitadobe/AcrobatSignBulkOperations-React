import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cell, Column, Row, TableView, TableBody, TableHeader, Heading, ToastQueue } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import Footer from "../../components/footer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const WidgetsAgreementsPage = () => {
  const widgetsAgreements = useSelector((state) => state.widgetsAgreements || []);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const authState = useSelector((state) => state.auth || {});

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Widget/Agreement Name', uid: 'name' },
    { name: 'Type', uid: 'type' },
    { name: 'Status', uid: 'status' },
  ];



  const downloadAllasZip = async () => {
    const idsToDownload = selectedKeys === "all"
      ? widgetsAgreements.filter(agreement => agreement !== null && agreement !== undefined).map(agreement => agreement.id)
      : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      ToastQueue.negative("No widgets selected for download.", { timeout: 5000 });
      return;
    }

    try {
      const zip = new JSZip();

      // Filter selected widgets based on selected keys
      const selectedWidgets = widgetsAgreements.filter(widget => widget && idsToDownload.includes(widget.id));

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
      ToastQueue.negative("Failed to download templates documents. Please try again.", { timeout: 5000 });
    }
  };

  const downloadFormField = async () => {
    const idsToDownload = selectedKeys === "all"
      ? widgetsAgreements.filter(agreement => agreement !== null && agreement !== undefined).map(agreement => agreement.id)
      : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No agreements selected for download.");
      ToastQueue.negative("No agreements selected for download.", { timeout: 5000 });
      return;
    }

    try {

      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-formfields', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload }),
      });

      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");

      // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "formfields.zip");


    } catch (error) {
      console.error("Download Form fields failed:", error);
      ToastQueue.negative("Failed to download form fields. Please try again.", { timeout: 5000 });
    }
  };
  const downloadAgreeements = async () => {
    const idsToDownload = selectedKeys === "all"
      ? widgetsAgreements.filter(agreement => agreement !== null && agreement !== undefined).map(agreement => agreement.id)
      : Array.from(selectedKeys);

    if (idsToDownload.length === 0) {
      alert("No agreements selected for download.");
      ToastQueue.negative("No agreements selected for download.", { timeout: 5000 });
      return;
    }

    try {
      // Send selected IDs to backend and get back the files
      const response = await fetch('/api/download-agreements', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ ids: idsToDownload }),
      });

      if (!response.ok) throw new Error("Failed to fetch agreements from the server.");

      // Convert response to a Blob and download as a zip file
      const blob = await response.blob();
      saveAs(blob, "agreements.zip");


    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download agreements. Please try again.");
      ToastQueue.negative("Failed to download agreements. Please try again.", { timeout: 5000 });
    }
  };



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
        <Heading level={2}>Total Agreements associated with Widgets: {widgetsAgreements.length}</Heading>
        <TableView
          selectionMode="multiple"
          aria-label="Widgets Table"
          gap="12"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          styles={style({
            height: 480,
            width: "full"
          })}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <Column
                id={column.uid}
                align="start"
                isRowHeader={column.uid === "id"}
              >
                {column.name}
              </Column>
            )}
          </TableHeader>

          <TableBody items={widgetsAgreements}>
            {(item) => (
              <Row id={String(item.id)} columns={columns}>
                <Cell>{item.id || "N/A"}</Cell>
                <Cell>{item.name || "N/A"}</Cell>
                <Cell>{item.type || "N/A"}</Cell>
                <Cell>{item.status || "N/A"}</Cell>
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
          showGetAgreements={false}
          showDownloadFormField={true}
          downloadList={async () => {
            downloadAllasZip();
          }}
          downloadOnPress={async () => {
            downloadAgreeements();
          }}
          downloadFormField={async () => {
            downloadFormField();
          }}
        />
      </div>
    </div>
  );
};

export default WidgetsAgreementsPage;
