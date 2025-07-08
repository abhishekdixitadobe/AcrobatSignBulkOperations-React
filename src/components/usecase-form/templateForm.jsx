import React, { useState, useRef } from "react";
import { Flex, DatePicker, TextField, Button, Item, ComboBox, DropZone, IllustratedMessage, Heading, Content, FileTrigger } from "@adobe/react-spectrum";
import Upload from '@spectrum-icons/illustrations/Upload';
import AgreementAction from "../../components/agreement-action";
import {today, getLocalTimeZone} from '@internationalized/date';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../drag-and-drop";
import { readCSV } from "../../utils/csvHelper";
import { setTemplates } from "../../redux/templateSlice";

const TemplateForm = ({onChange, setUploadFiles}) => {
    const [startDate, setStartDate] = useState(today(getLocalTimeZone()));
    const [endDate, setEndDate] = useState(today(getLocalTimeZone()));

    const authState = useSelector((state) => state.auth || {});
    const isAuthenticated = authState.isAuthenticated || false;
    const user = authState.user;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleApiCall = async (params) => {
        const { startDate, endDate } = params;
        try{
          const emails = await readCSV(selectedFiles);
            
                if (emails.length === 0) {
                  alert("No valid email addresses found in the file.");
                  return;
                }
        const apiUrl = `/api/libraryDocuments`;
        const groupedResults = {};
              const apiCalls = emails.map(async (email) => {
                const reqBody = {
                  startDate: formatToISO(startDate),
                  endDate: formatToISO(endDate),
                  email
                };
          
                try {
                  const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${authState.token}`,
                    },
                    body: JSON.stringify(reqBody),
                  });
          
                  if (response.ok) {
                    const data = await response.json();
                    groupedResults[email] = data; // Group results inside the loop
                  } else if (response.status === 401) {
                    alert("Session expired. Redirecting to login...");
                    navigate("/login");
                    throw new Error("Unauthorized");
                  } else {
                    throw new Error(`Failed to fetch for ${email}`);
                  }
                } catch (error) {
                  console.error(`Error processing ${email}:`, error);
                }
              });
          
              await Promise.all(apiCalls);
          
              // Dispatch grouped results
              dispatch(setTemplates({
                results: groupedResults,
                email: emails, // List of processed emails
              }));
          
              console.log('Grouped Results:', groupedResults);
              navigate("/templates");
          
        } catch (error) {
          console.error("Bulk download error:", error);
          alert("An error occurred while fetching agreements. Please try again.");
        }
      };
    // Helper function to convert CalendarDate to ISO string
    const formatToISO = (date) => {
        return new Date(date.year, date.month - 1, date.day).toISOString();
    };

    let [isFilled2, setIsFilled2] = React.useState(false);
    const isButtonEnabled = selectedFiles.length > 0;

    return (
        <>
            <Flex direction="column" gap="size-200">
                <DragAndDrop
                  heading="Upload active users list"
                  description="Or, select single CSV file from your computer"
                  acceptedFileTypes={["text/csv"]}
                  onImageDrop={(files) => {
                    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
                  }}
                  setUploadFiles={setUploadFiles}
                />
                <AgreementAction
                    params={{ startDate, endDate}}
                    onAction={handleApiCall}
                    buttonText="Get Templates"
                    isDisabled={!isButtonEnabled}
                    heading="Templates"
                />
            </Flex>
        </>
    );
};

export default TemplateForm;