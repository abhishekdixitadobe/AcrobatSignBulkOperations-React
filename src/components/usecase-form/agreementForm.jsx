import React, { useEffect, useState } from "react";
import { Flex, DatePicker, TextField, Item, ComboBox, Checkbox } from "@adobe/react-spectrum";
import { Accordion, Disclosure, DisclosureTitle, DisclosurePanel } from "@react-spectrum/accordion";
import { today, getLocalTimeZone } from "@internationalized/date";
import AgreementAction from "../../components/agreement-action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAgreements } from "../../redux/agreementsSlice";
import { readCSV } from "../../utils/csvHelper";
import DragAndDrop from "../drag-and-drop";
import { ToastQueue } from "@react-spectrum/toast";

const AgreementForm = ({ onChange, setUploadFiles }) => {
  const [startDate, setStartDate] = useState(today(getLocalTimeZone()));
  const [endDate, setEndDate] = useState(today(getLocalTimeZone()));
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateDateRange = (start, end) => start < end;

  const authState = useSelector((state) => state.auth || {});
  const user = authState.user;

  useEffect(() => {
    if (onChange) {
      // Get file metadata or URLs instead of the full File object
      const filesMetadata = selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file), // Optional if you need a URL reference
      }));
      onChange({ operation: "", files: filesMetadata });
    }
  }, [selectedFiles]);

  // Helper function to convert CalendarDate to ISO string
  const formatToISO = (date) => {
    return new Date(date.year, date.month - 1, date.day).toISOString();
  };

  const handleBulkUserAgreements = async (params) => {
    const { startDate, endDate, selectedStatuses } = params;

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      ToastQueue.negative("End date must be after start date.", { timeout: 5000 });
      return;
    }

    setIsLoading(true);

    try {
      const emails = await readCSV(selectedFiles);

      if (emails.length === 0) {
        ToastQueue.negative("No valid email addresses found in the file.", { timeout: 5000 });
        return;
      }

      const apiUrl = `/api/search`;

      // Process emails and group results in a single step
      const groupedResults = {};
      const apiCalls = emails.map(async (email) => {
        const reqBody = {
          startDate: formatToISO(startDate),
          endDate: formatToISO(endDate),
          email,
          title,
          selectedStatuses,
        };

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
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

      await Promise.all(apiCalls);

      // Dispatch grouped results
      dispatch(
        setAgreements({
          results: groupedResults,
          email: emails, // List of processed emails
        })
      );

      const groupResultsKeys = Object.keys(groupedResults);
      let totalResults = 0;
      for (let i = 0; i < groupResultsKeys.length; i++) {
        totalResults = totalResults + groupedResults[groupResultsKeys[i]]?.totalResults;
      }

      if (!totalResults) {
        ToastQueue.info("No agreements present for the users for the selected options", { timeout: 5000 });
        setIsLoading(false);
        return;
      }
      
      ToastQueue.positive("Agreements fetched successfully!!", { timeout: 5000 });
      navigate("/agreementsList");
    } catch (error) {
      console.error("Bulk download error:", error);
      ToastQueue.negative("An error occurred while fetching agreements. Please try again.",{ timeout: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiCall = async (params) => {
    const { startDate, endDate, email, selectedStatuses, title } = params;
    let errorMsg = "";

    // Validate email
    if (!email) {
      errorMsg = "Email is required.";
    } else {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      errorMsg = !regex.test(email) ? "Please enter a valid Email" : "";
    }

    // Validate date range
    if (!validateDateRange(startDate, endDate)) {
      errorMsg = "End date must be after start date.";
    }

    if (errorMsg) {
      ToastQueue.negative(errorMsg, { timeout: 5000 });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `/api/search`;

      const reqBody = {
        startDate: formatToISO(startDate),
        endDate: formatToISO(endDate),
        email,
        title,
        selectedStatuses,
      };

      // API call for the single email
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(reqBody),
      });

      if (response.ok) {
        const data = await response.json();

        // Group results similarly to handleBulkUserAgreements
        const groupedResults = {
          [email]: data,
        };

        ToastQueue.positive("Agreements fetched successfully!!", { timeout: 5000 });

        // Dispatch the results with the grouped structure
        dispatch(
          setAgreements({
            results: groupedResults,
            email: [email], // Maintain an array format for consistency
          })
        );

        if (data?.totalResults) {
          // Navigate to agreements list
          navigate("/agreementsList");
        } else {
          ToastQueue.info("No agreements present for this user for the selected options", { timeout: 5000 });
        }
      } else if (response.status === 401) {
        ToastQueue.negative("Session expired. Redirecting to login...", {
          timeout: 5000,
        });
        navigate("/login");
      } else {
        console.error("API call failed", response.statusText);
        ToastQueue.negative("Failed to fetch agreements. Please try again later.", { timeout: 5000 });
      }
    } catch (error) {
      console.error("Error making API call:", error);
      ToastQueue.negative("An error occurred. Please try again later.", { timeout: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = selectedFiles.length > 0 && selectedStatuses.size > 0;

  return (
    <Accordion>
      <Disclosure id="userAgreementLookup">
        <DisclosureTitle>User Agreement Lookup</DisclosureTitle>
        <DisclosurePanel>
          <Flex gap="size-200" wrap>
            <DatePicker
              label="Start Date"
              isRequired
              value={startDate}
              onChange={setStartDate}
            />
            <DatePicker
              label="End Date"
              isRequired
              value={endDate}
              onChange={setEndDate}
            />
            <TextField
              label="User Email"
              value={email}
              onChange={setEmail}
              type="email"
              isRequired
              necessityIndicator="label"
            />
            <TextField
              label="Agreement Title"
              value={title}
              onChange={setTitle}
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
              params={{
                startDate,
                endDate,
                email,
                title,
                selectedStatuses: Array.from(selectedStatuses),
              }}
              onAction={handleApiCall}
              buttonText={"Get Agreements"}
              isDisabled={!email || isLoading}
            />
          </Flex>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="bulkUserAgreements">
        <DisclosureTitle>Bulk User Agreements</DisclosureTitle>
        <DisclosurePanel>
          <Flex direction="column" gap="size-200">
            <Flex direction="row" gap="size-200">
              <DatePicker
                label="Start Date"
                isRequired
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="End Date"
                isRequired
                value={endDate}
                onChange={setEndDate}
              />
              <TextField
                label="Agreement Title"
                value={title}
                onChange={setTitle}
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
              params={{
                startDate,
                endDate,
                email,
                title,
                selectedStatuses: Array.from(selectedStatuses),
              }}
              onAction={handleBulkUserAgreements}
              buttonText="Get Agreements"
              isDisabled={!isButtonEnabled}
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
