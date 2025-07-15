import { Button, ButtonGroup, Flex, View } from "@adobe/react-spectrum";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = (props) => {
  const {
    disabledBack = false,
    showDownload = false,
    showDownloadFormField = false,
    showAuditReport = false,
    showDelete = false,
    showDownloadList = false,
    showGetAgreements = false,
    deleteOnPress = () => {},
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
    <View backgroundColor={"gray-50"} height="100%">
      <Flex direction="row" height="100%" gap="size-100" alignItems={"center"}>
        <View paddingX={"size-800"} width="100%">
          <Flex justifyContent="space-between">
            <Flex justifyContent="end">
              <ButtonGroup>
                <Button
                  UNSAFE_className="cursorPointer"
                  variant="secondary"
                  onPress={() => window.history.back()}
                  isDisabled={disabledBack}
                >
                  Back
                </Button>

                {showDownload && (
                  <Button
                    UNSAFE_className="cursorPointer"
                    variant="cta"
                    isPending={isLoading.download}
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
                    onPress={() =>
                      handleAsyncAction(downloadList, "downloadList")
                    }
                  >
                    Download List
                  </Button>
                )}

                {showGetAgreements && (
                  <Button
                    UNSAFE_className="cursorPointer"
                    variant="cta"
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
                    onPress={() =>
                      handleAsyncAction(downloadFormField, "downloadFormField")
                    }
                  >
                    Download Form Fields
                  </Button>
                )}

                {showAuditReport && (
                  <Button
                    UNSAFE_className="cursorPointer"
                    variant="cta"
                    isPending={isLoading.auditReport}
                    onPress={() =>
                      handleAsyncAction(downloadAuditReport, "auditReport")
                    }
                  >
                    Download Audit Report
                  </Button>
                )}

                {showDelete && (
                  <Button
                    UNSAFE_className="cursorPointer"
                    variant="cta"
                    isPending={isLoading.delete}
                    onPress={() => handleAsyncAction(deleteOnPress, "delete")}
                  >
                    Delete Agreements
                  </Button>
                )}
              </ButtonGroup>
            </Flex>
          </Flex>
        </View>
      </Flex>
    </View>
  );
};

export default Footer;
