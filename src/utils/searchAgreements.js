import Logger from "./logger";
import store from "../redux/store";


// Main function to process search agreements
async function agreements(params) {
  console.log("Inside /api/search--");
  
  const { startDate, endDate, email } = params;
  try {
    // Construct API URL or body
    const apiUrl = `/api/search`;
    const reqBody = {
      "startDate": startDate,
      "endDate":endDate,
      "email": email,
    }
    const response = await fetch(apiUrl, reqBody, {
      method: "POST", // Or POST depending on the API
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Agreements Data: ", data); // Handle the response data
    } else {
      console.error("API call failed", response.statusText);
    }
  } catch (error) {
    console.error("Error making API call:", error);
  }
}


export { searchAgreements };
