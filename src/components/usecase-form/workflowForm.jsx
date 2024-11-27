import React, { useState, useEffect } from "react";
import {
    Flex, DatePicker, ComboBox, DropZone,
    IllustratedMessage, Heading, Content, FileTrigger, Button, Item
} from "@adobe/react-spectrum";
import Upload from '@spectrum-icons/illustrations/Upload';
import AgreementAction from "../../components/agreement-action";
import { parseDate } from "@internationalized/date";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../drag-and-drop";
import { readCSV } from "../../utils/csvHelper";

const WorkflowForm = ({onChange, setUploadFiles}) => {
    const [startDate, setStartDate] = useState(parseDate("2023-01-03"));
    const [endDate, setEndDate] = useState(parseDate("2023-06-03"));
    const [email, setEmail] = useState("");
    const [majorId, setMajorId] = useState(null);
    const [isFilled1, setIsFilled1] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const authState = useSelector((state) => state.auth || {});
    const isAuthenticated = authState.isAuthenticated || false;
    const user = authState.user;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = authState.token;

    // Helper function to convert CalendarDate to ISO string
    const formatToISO = (date) => {
        return new Date(date.year, date.month - 1, date.day).toISOString();
    };

    // Function to call the /api/workflows endpoint on component mount
    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const apiUrl = `/api/workflows`;
                
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authState.token}` 
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Workflows Data: ", data);
                    setWorkflows(data.userWorkflowList); 
                } else {
                    console.error("API call to /api/workflows failed", response.statusText);
                }
            } catch (error) {
                console.error("Error making API call to /api/workflows:", error);
            }
        };

        fetchWorkflows();
    }, [email]); // Dependency on email, so it fetches workflows if email changes

    const handleApiCall = async (params) => {
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
      
          const apiUrl = `/api/search`;
          const apiCalls = emails.map(email => {
            const reqBody = { 
              startDate: formatToISO(startDate), // Convert to ISO string
              endDate: formatToISO(endDate), 
              email
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
          const userWorkflowList = results.flatMap(data => data.userWorkflowList);
          
          dispatch(setWorkflows(userWorkflowList));
          navigate("/workflowList");
          
        } catch (error) {
          console.error("Bulk download error:", error);
          alert("An error occurred while fetching agreements. Please try again.");
        }
      };
    const isButtonEnabled = email && selectedFiles.length > 0;
    return (
        <>
            <Flex direction="column" gap="size-100">
                <Flex direction="row" gap="size-100">
                    <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                    <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
                    <AgreementAction
                        params={{ startDate, endDate, email }}
                        onAction={handleApiCall}
                        buttonText="Get Agreements"
                        isDisabled={!isButtonEnabled}
                        heading="Agreements"
                    />
                </Flex>
                <DragAndDrop
                  heading="Upload agreement Ids list"
                  description="Or, select single CSV file from your computer"
                  acceptedFileTypes={["text/csv"]}
                  onImageDrop={(files) => {
                    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
                  }}
                  setUploadFiles={setUploadFiles}
                />
            </Flex>
        </>
    );
};

export default WorkflowForm;
