import React, { useState, useRef } from "react";
import { Flex, DatePicker, TextField, Button, Item, ComboBox, DropZone, IllustratedMessage, Heading, Content, FileTrigger, ToastQueue } from "@adobe/react-spectrum";
import Upload from "@spectrum-icons/illustrations/Upload";
import AgreementAction from "../../components/agreement-action";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../drag-and-drop";
import { readCSV } from "../../utils/csvHelper";
import { setTemplates } from "../../redux/templateSlice";

const TemplateForm = ({ onChange, setUploadFiles }) => {
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

    try {
      // Load and parse the CSV file
      const emails = await readCSV(selectedFiles);

      if (emails.length === 0) {
        ToastQueue.negative("No valid email addresses found in the file.", { timeout: 5000 });
        return;
      }

      const apiUrl = `/api/libraryDocuments`;
      const groupedResults = {};

      const apiCalls = emails.map(async (email) => {
        const reqBody = {
          startDate: formatToISO(startDate),
          endDate: formatToISO(endDate),
          email,
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
            ToastQueue.negative("Session expired. Redirecting to login...", { timeout: 5000 });
            navigate("/login");
            throw new Error("Unauthorized");
          } else {
            throw new Error(`Failed to fetch for ${email}`);
          }
        } catch (error) {
          console.error(`Error processing ${email}:`, error);
        }
      });

      // Await all API calls
      await Promise.all(apiCalls);

      dispatch(setTemplates({
        results: groupedResults,
        email: emails, // List of processed emails
      }));

      const groupResultsKeys = Object.keys(groupedResults);
      let totalResults = 0;
      for (let i = 0; i < groupResultsKeys.length; i++) {
        totalResults = totalResults + groupedResults[groupResultsKeys[i]]?.totalResults;
      }

      if (!totalResults) {
        ToastQueue.info("No templates present for the users.", { timeout: 5000 });
        return;
      }
      
      ToastQueue.positive("Templates fetched successfully!!", { timeout: 5000 });
      navigate("/templates");
    } catch (error) {
      console.error("Bulk download error:", error);
      ToastQueue.negative("An error occurred while fetching agreements. Please try again.", { timeout: 5000 });
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
          params={{ startDate, endDate }}
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
