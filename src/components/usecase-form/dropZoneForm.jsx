import React, { useEffect, useState } from "react";
import DragAndDrop from "../drag-and-drop";

const DropZoneForm = ({ action, onChange, showCSVDropZone = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCSV, setSelectedCSV] = useState([]);

  useEffect(() => {
    if (onChange) {
      onChange({
        action: action,
        files: { images: selectedFiles, csv: selectedCSV },
      });
    }
  }, [selectedFiles, selectedCSV]);

  return (
    <>
      <DragAndDrop
        heading="Drag and drop images"
        description="Or, select multiple files from your computer"
        acceptedFileTypes={["image/jpeg", "image/png"]}
        allowMultiple
        onImageDrop={(file) => {
          console.log(file);
          setSelectedFiles(file);
        }}
      />
      {showCSVDropZone && (
        <DragAndDrop
          heading="Drag and drop CSV"
          description="Or, select single CSV file from your computer"
          acceptedFileTypes={["text/csv"]}
          onImageDrop={(file) => {
            console.log(file);
            setSelectedCSV(file);
          }}
        />
      )}
    </>
  );
};

export default DropZoneForm;
