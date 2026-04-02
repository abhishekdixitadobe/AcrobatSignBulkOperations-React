import { Button, ButtonGroup, Flex, View } from "@adobe/react-spectrum";
import { useState } from "react";

const Footer = (props) => {
  const {
    disabledBack = false,
    hasSelection = true,
    showDownload = false,
    showDownloadFormField = false,
    showAuditReport = false,
    showDelete = false,
    showDeleteTemplate = false,
    showDownloadList = false,
    showGetAgreements = false,
    deleteOnPress = () => {},
    deleteTemplateOnPress = () => {},
    downloadOnPress = () => {},
    downloadList = () => {},
    downloadFormField = () => {},
    downloadAuditReport = () => {},
    agreementList = () => {},
  } = props;

  const [isLoading, setIsLoading] = useState({
    download: false,
    downloadList: false,
    downloadFormField: false,
    auditReport: false,
    delete: false,
    deleteTemplate: false,
  });

  const handleAsyncAction = async (action, key) => {
    setIsLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await action();
    } finally {
      setIsLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <View backgroundColor="gray-50" height="100%">
      <Flex direction="row" height="100%" alignItems="center" paddingX="size-800">
        <Flex justifyContent="space-between" alignItems="center" width="100%">

          <Button
            UNSAFE_className="cursorPointer"
            variant="secondary"
            onPress={() => window.history.back()}
            isDisabled={disabledBack}
          >
            Back
          </Button>

          <ButtonGroup>
            {showDownload && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isPending={isLoading.download}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(downloadOnPress, "download")}
              >
                Download
              </Button>
            )}

            {showDownloadList && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isPending={isLoading.downloadList}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(downloadList, "downloadList")}
              >
                Download List
              </Button>
            )}

            {showGetAgreements && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isDisabled={!hasSelection}
                onPress={agreementList}
              >
                Get Agreements
              </Button>
            )}

            {showDownloadFormField && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isPending={isLoading.downloadFormField}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(downloadFormField, "downloadFormField")}
              >
                Download Form Fields
              </Button>
            )}

            {showAuditReport && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isPending={isLoading.auditReport}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(downloadAuditReport, "auditReport")}
              >
                Download Audit Report
              </Button>
            )}

            {showDelete && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="cta"
                isPending={isLoading.delete}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(deleteOnPress, "delete")}
              >
                Delete Agreements
              </Button>
            )}

            {showDeleteTemplate && (
              <Button
                UNSAFE_className="cursorPointer"
                variant="negative"
                isPending={isLoading.deleteTemplate}
                isDisabled={!hasSelection}
                onPress={() => handleAsyncAction(deleteTemplateOnPress, "deleteTemplate")}
              >
                Delete Templates
              </Button>
            )}
          </ButtonGroup>

        </Flex>
      </Flex>
    </View>
  );
};

export default Footer;
