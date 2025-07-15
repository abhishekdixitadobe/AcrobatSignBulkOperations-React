import React, { useState, useRef } from "react";
import { Flex, DatePicker, TextField, Button, Item, ComboBox, DropZone, IllustratedMessage, Heading, Content, FileTrigger, ToastQueue } from "@adobe/react-spectrum";
import Upload from "@spectrum-icons/illustrations/Upload";
import AgreementAction from "../../components/agreement-action";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../drag-and-drop";
import { readCSV } from "../../utils/csvHelper";
import { setWidgets } from "../../redux/webformSlice";

const WebForm = ({ onChange, setUploadFiles }) => {
  const authState = useSelector((state) => state.auth || {});
  const isAuthenticated = authState.isAuthenticated || false;
  const user = authState.user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState([]);

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
        ToastQueue.negative("No valid email addresses found in the file.", { timeout: 5000 });
        return;
      }

      const apiUrl = `/api/widgets`;
      const apiCalls = emails.map((email) => {
        const reqBody = {
          email,
        };

        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(reqBody),
        }).then((response) => {
          if (response.ok) return response.json();
          else throw new Error(`Failed to fetch for ${email}`);
        });
      });

      // Await all API calls
      const results = await Promise.all(apiCalls);
      // Combine results from each email
      const userWidgetList = results.flatMap((data) => data.userWidgetList);

      dispatch(setWidgets(userWidgetList));

      if (userWidgetList.length < 1) {
        ToastQueue.info("No webforms present for the users.", { timeout: 5000 });
        return;
      }
      
      ToastQueue.positive("Webforms fetched successfully!!", { timeout: 5000 });
      navigate("/widgets");
    } catch (error) {
      console.error("Bulk download error:", error);
      ToastQueue.negative("An error occurred while fetching widgets. Please try again.", { timeout: 5000 });
    }
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
          onAction={handleApiCall}
          buttonText="Get Webforms"
          isDisabled={!isButtonEnabled}
          heading="Webforms"
        />
      </Flex>
    </>
  );
};

export default WebForm;
