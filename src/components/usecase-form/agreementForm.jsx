import React, { useEffect, useState } from "react";
import { Flex, DatePicker, TextField, Item, ComboBox, Checkbox, ActionButton, View } from "@adobe/react-spectrum"; 
import {Accordion, Disclosure, DisclosureHeader, DisclosurePanel} from '@react-spectrum/accordion'

import Upload from '@spectrum-icons/illustrations/Upload';
import AgreementAction from "../../components/agreement-action";
import { parseDate } from "@internationalized/date"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAgreements} from "../../redux/agreementsSlice";
import { readCSV } from "../../utils/csvHelper";
import DragAndDrop from "../drag-and-drop";

const AgreementForm = ({onChange, setUploadFiles}) => {
  const [startDate, setStartDate] = useState(parseDate("2023-01-03"));
  const [endDate, setEndDate] = useState(parseDate("2023-06-03"));
  const [email, setEmail] = useState("");
  let [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const agreementStatusOptions = [
    { id: "OUT_FOR_SIGNATURE", name: "Send for signature" },
    { id: "SIGNED", name: "Signed" },
    { id: "EXPIRED", name: "Expired" },
    { id: "ACCEPTED", name: "Accepted" },
    { id: "APPROVED", name: "Approved" },
    { id: "ACTIVE", name: "Active" }

  ];

  const toggleStatus = (statusId) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      newSet.has(statusId) ? newSet.delete(statusId) : newSet.add(statusId);
      return newSet;
    });
  };
  const handleSelectionChange = (keys) => {
    setSelectedKeys(new Set(keys));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateDateRange = (start, end) => start <= end;

  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated || false;
  const user = authState.user;
    
  const token = authState.token;

  useEffect(() => {
    if (onChange) {
      // Get file metadata or URLs instead of the full File object
      const filesMetadata = selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),  // Optional if you need a URL reference
      }));
      onChange({ operation: "", files: filesMetadata });
    }
  }, [selectedFiles]);
  

  // Helper function to convert CalendarDate to ISO string
  const formatToISO = (date) => {
    return new Date(date.year, date.month - 1, date.day).toISOString();
  };

  let [majorId, setMajorId] = React.useState(null);
  let [isFilled1, setIsFilled1] = React.useState(false);
  let [isFilled2, setIsFilled2] = React.useState(false);
  
  
  const handleBulkUserAgreements = async (params) => {
    const { startDate, endDate } = params;

    // Ensure file upload exists
    /*if (!isFilled1) {
      alert("Please upload a file containing emails.");
      return;
    }*/
  
    setIsLoading(true);
  
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
          if (response.status === 401) {
            alert("Session expired. Redirecting to login...");
            navigate("/login");
            throw new Error("Unauthorized");
          } 
          throw new Error(`Failed to fetch for ${email}`);
        });
      });
  
      // Await all API calls
      const results = await Promise.all(apiCalls);
      
      // Combine results from each email
      const agreements = results.flatMap(data => data.agreementAssetsResults);
      
      dispatch(setAgreements(agreements));
      navigate("/agreementsList");
      
    } catch (error) {
      console.error("Bulk download error:", error);
      alert("An error occurred while fetching agreements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiCall = async (params) => {
    const { startDate, endDate, email, selectedStatuses } = params;

    
    // Validate email and date range
    if (null === email) {
      setEmail(user.email);
    }
    if (!validateDateRange(startDate, endDate)) {
      alert("End date must be after start date.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `/api/search`;
      const reqBody = { 
        startDate: formatToISO(startDate), // Convert to ISO string
        endDate: formatToISO(endDate), 
        email,
        selectedStatuses
      };
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
        console.log("Fetched Agreements Data:", data);
        
        dispatch(setAgreements(data.agreementAssetsResults));
        navigate("/agreementsList");
      } else if (response.status === 401) {
        alert("Session expired. Redirecting to login...");
        navigate("/login");
      }  else {
        console.error("API call failed", response.statusText);
        alert("Failed to fetch agreements. Please try again later.");
      }
    } catch (error) {
      console.error("Error making API call:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Accordion>
      <Disclosure id="userAgreementLookup">
        <DisclosureHeader>User Agreement Lookup</DisclosureHeader>
        <DisclosurePanel>
          <Flex gap="size-200" wrap>
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
            <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
            <TextField
              label="User Email"
              value={email}
              onChange={setEmail}
              type="email"
              necessityIndicator="label"
            />
            <ComboBox label="Select Statuses" onSelectionChange={() => {}}>
              {agreementStatusOptions.map((option) => (
                <Item key={option.id} textValue={option.name}>
                  <Checkbox
                    isSelected={selectedStatuses.has(option.id)}
                    onChange={() => toggleStatus(option.id)}
                  >
                    {option.name}
                  </Checkbox>
                </Item>
              ))}
            </ComboBox>
            <AgreementAction
              params={{ startDate, endDate, email, selectedStatuses: Array.from(selectedStatuses)}}
              onAction={handleApiCall}
              buttonText={"Get Agreements"}
              isDisabled={!email || isLoading}
            />
          </Flex>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="bulkUserAgreements">
        <DisclosureHeader>Bulk User Agreements</DisclosureHeader>
          <DisclosurePanel>
            <Flex direction="column" gap="size-200">
              <Flex direction="row" gap="size-200">
                <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
                
              </Flex>
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
                  params={{ startDate, endDate, email }}
                  onAction={handleBulkUserAgreements}
                  buttonText="Get Agreements"
                  isDisabled={!email}
                  heading="Agreements"
                />
            </Flex>
          </DisclosurePanel>
      </Disclosure>
      {/*
        <Disclosure id="agreementIdSearch">
          <DisclosureHeader>Agreement ID Search</DisclosureHeader>
            <DisclosurePanel>
                <Flex direction="column" gap="size-200">
                <DragAndDrop
                    heading="Upload agreement Ids list"
                    description="Or, select single CSV file from your computer"
                    acceptedFileTypes={["text/csv"]}
                    onImageDrop={(files) => {
                      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
                    }}
                    setUploadFiles={setUploadFiles}
                  />
                  <AgreementAction
                    params={{ startDate, endDate, email }}
                    onAction={handleApiCall}
                    buttonText="Get Agreements"
                    isDisabled={!email}
                    heading="Agreements"
                  />
                </Flex>
            </DisclosurePanel>
        </Disclosure> 
      */}
    </Accordion>
);
};

export default AgreementForm;