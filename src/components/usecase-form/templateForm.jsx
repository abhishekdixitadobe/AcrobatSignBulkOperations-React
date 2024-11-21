import React, { useState, useRef } from "react";
import { Flex, DatePicker, TextField, Button, Item, ComboBox, DropZone, IllustratedMessage, Heading, Content, FileTrigger } from "@adobe/react-spectrum";
import Upload from '@spectrum-icons/illustrations/Upload';
import AgreementAction from "../../components/agreement-action";
import { parseDate } from "@internationalized/date";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../drag-and-drop";
import { readCSV } from "../../utils/csvHelper";
import { setTemplates } from "../../redux/templateSlice";

const TemplateForm = ({onChange, setUploadFiles}) => {
    const [startDate, setStartDate] = useState(parseDate("2023-01-03"));
    const [endDate, setEndDate] = useState(parseDate("2023-06-03"));

    const authState = useSelector((state) => state.auth || {});
    const isAuthenticated = authState.isAuthenticated || false;
    const user = authState.user;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleApiCall = async (params) => {
        const { startDate, endDate } = params;
    
        // Ensure file upload exists
        /*if (!isFilled1) {
          alert("Please upload a file containing emails.");
          return;
        }*/
      
        try {
          // Load and parse the CSV file
          const emails = await readCSV(selectedFiles);
      
          if (emails.length === 0) {
            alert("No valid email addresses found in the file.");
            return;
          }
      
          const apiUrl = `/api/libraryDocuments`;
          const apiCalls = emails.map(email => {
            const reqBody = {
              startDate: formatToISO(startDate),
              endDate: formatToISO(endDate),
              email,
            };
            
            return fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState.token}`,
              },
              body: JSON.stringify(reqBody),
            }).then(response => {
              if (response.ok) return response.json();
              else throw new Error(`Failed to fetch for ${email}`);
            });
          });
      
          // Await all API calls
          const results = await Promise.all(apiCalls);
          
          // Combine results from each email
          const libraryDocuments = results.flatMap(data => data.libraryDocuments);
          
          dispatch(setTemplates(libraryDocuments));
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