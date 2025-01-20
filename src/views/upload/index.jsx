import { Form, Grid, Heading, Text, View } from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Footer from "../../components/footer";
import UseCaseForm from "../../components/usecase-form";
import { setRequests, resetProcessApis } from "../../redux/processApis";
import { resetLogEvents } from "../../redux/logEvent";
import { setDownloadURLs, resetURLs } from "../../redux/downloadURLs";

const Upload = () => {
  const location = useLocation();
  console.log(location.state);
  const configs = location.state.configs;
  const heading = location.state.heading;
  const [formData, setFormData] = useState({});
  const [isExecuted, setisExecuted] = useState(false);

  // Frontend AIO Things
  const [operation, setOperation] = useState("removeBackground");
  const [uploadFiles, setUploadFiles] = useState([]);
  const apiEndpoint = useSelector((state) => state.navState.api);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProcessApis());
    dispatch(resetLogEvents());
    dispatch(resetURLs());
    setUploadFiles([]);
  }, []);

  const handleFormChange = (data) => {
    if (data) {
      if (data.operation === operation) {
        setUploadFiles((prevFiles) => [...prevFiles, ...data.files]);
      }
      setOperation(data.operation);
      setFormData(data);
      dispatch(
        setRequests([
          {
            apiEndpoint: configs.api,
            method: "POST",
            body: data,
          },
        ])
      );
    }
  };

  const handleAPIRequest = async () => {
    let results = [];
    switch (apiEndpoint) {
      case "/api/agreements":
        results = await agreements(uploadFiles);
        break;
      case "/api/workflows":
        results = await agreements(uploadFiles);
        break;
      case "/api/templates":
        results = await agreements(uploadFiles);
        break;
      case "/api/webforms":
        results = await agreements(uploadFiles);
        break;
        default:
        break;
    }
    dispatch(setDownloadURLs(results));
  };

  return (
    <Grid
      areas={["content", "footer"]}
      height="100%"
      width="100%"
      columns={["1fr"]}
      rows={["1fr", "auto"]}
    >
      <View gridArea="content" width="75%" marginX="auto">
        {!isExecuted ? (
          <>
            <Heading level={1}>{heading}</Heading>
            <Text>
            Agreements will be fetched between this date range.
            </Text>
            <Form necessityIndicator="label">
              <UseCaseForm
                id={configs.formComponentId}
                onFormChange={handleFormChange}
                setUploadFiles={setUploadFiles}
              />
            </Form>
          </>
        ) : (
          ''
        )}
      </View>
      <View gridArea="footer" width="100%" height={"size-1000"}>
        <Footer
          disableBack={isExecuted}
          disableExecute={isExecuted}
          executeOnPress={() => {
            setisExecuted(false);
            dispatch(setIsDisabled(false));
            console.log(isExecuted);
            handleAPIRequest();
          }}
        />
      </View>
    </Grid>
  );
};

export default Upload;
