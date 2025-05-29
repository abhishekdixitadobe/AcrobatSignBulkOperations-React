import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Generic API call method
 * @param {string} endpoint - API endpoint to call.
 * @param {string} method - HTTP method (GET, POST, etc.).
 * @param {object} token - Authorization token for the API request.
 * @param {object} [body] - Request payload (optional).
 * @returns {Promise<Response>} - API response.
 */
const apiCall = async (endpoint, method, token, body) => {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

/**
 * Downloads files from the server as a ZIP archive.
 * @param {string} endpoint - API endpoint to call.
 * @param {Array<string>} ids - IDs of the items to download.
 * @param {string} token - Authorization token for the API request.
 * @param {string} fileName - Name of the ZIP file to save.
 */
export const downloadFilesAsZip = async (endpoint, agreementsToDownload, token, fileName, flattenedAgreements) => {
  if (agreementsToDownload.length === 0) {
    alert("No items selected for download.");
    return;
  }

  try {
    const response = await apiCall(endpoint, "POST", token, {agreements: agreementsToDownload});

    // Convert response to Blob and download as a ZIP file
    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error(`Failed to download files from ${endpoint}:`, error);
    alert("Download failed. Please try again.");
  }
};

export const downloadList = async (ids, agreements, fileName, emailsToDownload) => {
  if (ids.length === 0) {
    alert("No items selected for download.");
    return;
  }

  try {
    const zip = new JSZip();

    // Filter selected agreements based on selected keys
    const selectedAgreements = agreements.filter(
      (agreement) => agreement && ids.includes(agreement.id)
    );

    // Convert selected agreements to CSV format
    let csvContent = "ID,Agreement Name,Status,Email\n"; // Added "Email" column header
    selectedAgreements.forEach((agreement, index) => {
      const email = emailsToDownload[index]; // Match email by index
      csvContent += `${agreement.id},${agreement.name},${agreement.status},${email}\n`; // Include email in each row
    });

    // Add CSV content to the ZIP file
    zip.file("selected_agreements.csv", csvContent);

    // Generate the ZIP file and trigger download
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, fileName || "selected_agreements.zip"); // Use `fileName` parameter for zip name

  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download agreements documents. Please try again.");
  }
};
