import React from "react";
import AgreementForm from "./agreementForm";
import WorkflowForm from "./workflowForm";
import TemplateForm from "./templateForm";
import WebForm from "./webForm";

const UseCaseForm = ({ id, onFormChange, setUploadFiles }) => {
  switch (id) {
    case "agreements":
      return (
        <AgreementForm
          action="agreements"
          onChange={onFormChange}
          setUploadFiles={setUploadFiles}
        />
      );
    case "workflows":
      return (
        <WorkflowForm
          action="workflows"
          onChange={onFormChange}
          setUploadFiles={setUploadFiles}
        />
      );
    case "templates":
      return (
        <TemplateForm
          action="templates"
          onChange={onFormChange}
          setUploadFiles={setUploadFiles}
        />
      );
    case "webforms":
      return (
        <WebForm
          action="webforms"
          onChange={onFormChange}
          setUploadFiles={setUploadFiles}
        />
      );
    default:
      return <p>Nothing to display</p>; // This shows when no case is matched
  }
};

export default UseCaseForm;
