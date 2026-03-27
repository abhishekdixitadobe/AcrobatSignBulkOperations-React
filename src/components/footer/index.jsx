import { Button, ButtonGroup } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
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
    <div
      className={style({
        backgroundColor: "gray-25",
        height: "full"
      })}>
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          height: "full",
          gap: 8,
          alignItems: "center"
        })}>
        <div
          className={style({
            paddingX: 64,
            width: "full"
          })}>
          <div className={style({
            display: "flex",
            justifyContent: "space-between"
          })}>
            <div className={style({
              display: "flex",
              justifyContent: "end"
            })}>
              <ButtonGroup>
                <Button
                  styles={style({
                    cursor: "pointer"
                  })}
                  UNSAFE_className="cursorPointer"
                  variant="secondary"
                  onPress={() => window.history.back()}
                  isDisabled={disabledBack}
                >
                  Back
                </Button>

                {showDownload && (
                  <Button
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
                    isPending={isLoading.download}
                    onPress={() => handleAsyncAction(downloadOnPress, "download")}
                  >
                    Download
                  </Button>
                )}

                {showDownloadList && (
                  <Button
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
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
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
                    onPress={agreementList}
                  >
                    Get Agreements
                  </Button>
                )}

                {showDownloadFormField && (
                  <Button
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
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
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
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
                    styles={style({
                      cursor: "pointer"
                    })}
                    variant="accent"
                    isPending={isLoading.delete}
                    onPress={() => handleAsyncAction(deleteOnPress, "delete")}
                  >
                    Delete Agreements
                  </Button>
                )}
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
