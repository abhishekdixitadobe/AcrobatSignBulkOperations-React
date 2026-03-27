import { Form, Heading, Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
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
    <div
      className={style({
        display: "grid",
        gridTemplateAreas: ["content", "footer"],
        height: "full",
        width: "full",
        gridTemplateColumns: ["1fr"],
        gridTemplateRows: ["1fr", "auto"]
      })}>
      <div
        className={style({
          gridArea: "content",
          width: "[75%]",
          marginX: "[auto]"
        })}>
        {!isExecuted ? (
          <>
            <Heading level={1}>{heading}</Heading>
            <Text>Agreements will be fetched between the date range.</Text>
            <Form necessityIndicator="label">
              <UseCaseForm
                id={configs.formComponentId}
                onFormChange={handleFormChange}
                setUploadFiles={setUploadFiles}
              />
            </Form>
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className={style({
          gridArea: "footer",
          width: "full",
          height: 80
        })}>
        <Footer
          disableBack={isExecuted}
          disableExecute={isExecuted}
          executeOnPress={() => {
            setisExecuted(false);
            dispatch(setIsDisabled(false));
            handleAPIRequest();
          }}
        />
      </div>
    </div>
  );
};

export default Upload;
