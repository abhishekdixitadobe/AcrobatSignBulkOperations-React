import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTemplates } from "../../redux/templateSlice";
import {
  AlertDialog,
  Cell,
  Column,
  Content,
  DialogContainer,
  Flex,
  Grid,
  Heading,
  IllustratedMessage,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  View,
} from "@adobe/react-spectrum";
import Footer from "../../components/footer";
import { downloadFilesAsZip, downloadList, deleteTemplates } from "../../services/apiService";

const TemplatePage = () => {
  const dispatch = useDispatch();
  const agreementAssetsResults = useSelector((state) => state.templates || []);
  const columns = [
    { name: "Template Name", uid: "name" },
    { name: "Owner Email", uid: "ownerEmail" },
    { name: "Sharing Mode", uid: "sharingMode" },
    { name: "Status", uid: "status" },
    { name: "ID", uid: "id" },
  ];
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const authState = useSelector((state) => state.auth || {});
  const token = authState.token;

  const templateAssetsResults = agreementAssetsResults.templateAssetsResults || {};

  const seenIds = new Set();
  const flattenedAgreements = Object.entries(templateAssetsResults).flatMap(
    ([email, result]) =>
      (result.libraryDocuments || []).map((doc) => ({
        ...doc,
        email,
      }))
  ).filter((doc) => {
    if (seenIds.has(doc.id)) return false;
    seenIds.add(doc.id);
    return true;
  });

  const hasSelection = selectedKeys === "all" || selectedKeys.size > 0;
  const selectedCount = selectedKeys === "all" ? flattenedAgreements.length : selectedKeys.size;

  const handleDownloadList = async (fileName) => {
    const selectedRows =
      selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((doc) => selectedKeys.has(doc.id));

    const idsToDownload = selectedRows.map((row) => row.id);
    const emailsToDownload = selectedRows.map((row) => row.email);
    await downloadList(idsToDownload, flattenedAgreements, fileName, emailsToDownload);
  };

  const handleDeleteTemplates = async () => {
    const selectedRows =
      selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((doc) => selectedKeys.has(doc.id));

    const templatesToDelete = selectedRows.map((row) => ({ id: row.id, email: row.ownerEmail || row.email }));

    const results = await deleteTemplates(templatesToDelete, token);
    const deletedIds = (results || [])
      .filter((r) => r.success)
      .map((r) => r.id);
    if (deletedIds.length > 0) {
      dispatch(removeTemplates(deletedIds));
    }
    setSelectedKeys(new Set());
  };

  const handleDownload = async (endpoint, fileName) => {
    const selectedRows =
      selectedKeys === "all"
        ? flattenedAgreements
        : flattenedAgreements.filter((doc) => selectedKeys.has(doc.id));

    const agreementsToDownload = selectedRows.map((row) => ({ id: row.id, email: row.email }));
    await downloadFilesAsZip(endpoint, agreementsToDownload, token, fileName, flattenedAgreements);
  };

  return (
    <>
      <DialogContainer onDismiss={() => setIsDeleteDialogOpen(false)}>
        {isDeleteDialogOpen && (
          <AlertDialog
            title="Delete Templates"
            variant="destructive"
            primaryActionLabel="Delete"
            cancelLabel="Cancel"
            onPrimaryAction={handleDeleteTemplates}
          >
            Are you sure you want to delete {selectedCount} template{selectedCount !== 1 ? "s" : ""}?
            This action cannot be undone.
          </AlertDialog>
        )}
      </DialogContainer>

      <Grid
        areas={["content", "footer"]}
        height="100%"
        width="100%"
        columns={["1fr"]}
        rows={["1fr", "auto"]}
        marginTop="size-200"
      >
        <View gridArea="content" width="75%" marginX="auto" overflow="auto">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="size-100"
          >
            <Heading level={2}>Total Templates: {flattenedAgreements.length}</Heading>
            {hasSelection && (
              <Text>{selectedCount} selected</Text>
            )}
          </Flex>
          <TableView
            selectionMode="multiple"
            aria-label="Template Table"
            height="size-6000"
            width="100%"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            renderEmptyState={() => (
              <IllustratedMessage>
                <Heading>No templates found</Heading>
                <Content>Go back and run a template search first.</Content>
              </IllustratedMessage>
            )}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <Column key={column.uid} align="start">
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={flattenedAgreements}>
              {(item) => (
                <Row key={item.id}>
                  <Cell>{item.name || "N/A"}</Cell>
                  <Cell>{item.ownerEmail || "N/A"}</Cell>
                  <Cell>{item.sharingMode || "N/A"}</Cell>
                  <Cell>{item.status || "N/A"}</Cell>
                  <Cell>{item.id || "N/A"}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
        </View>

        <View gridArea="footer" width="100%" height="size-1000">
          <Footer
            showDownload={true}
            showDownloadList={true}
            showDownloadFormField={true}
            showDeleteTemplate={true}
            hasSelection={hasSelection}
            downloadList={() => handleDownloadList("templates.zip")}
            downloadOnPress={() => handleDownload("/api/download-templateDocument", "templates.zip")}
            downloadFormField={() => handleDownload("/api/download-templateFormfields", "formfields.zip")}
            deleteTemplateOnPress={() => setIsDeleteDialogOpen(true)}
          />
        </View>
      </Grid>
    </>
  );
};

export default TemplatePage;
