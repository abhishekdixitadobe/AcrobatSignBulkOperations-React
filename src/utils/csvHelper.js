import Papa from 'papaparse';

// Email validation regex
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Function to read CSV file content and return an array of email addresses
async function readCSV(files) {
  let emailList = [];

  // Iterate through each file
  for (const file of files) {
    if (!(file instanceof Blob)) {
      throw new Error("Provided file is not of type Blob or File");
    }

    const csvData = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        resolve(event.target.result);
      };

      reader.onerror = function() {
        reject("Error reading the CSV file");
      };

      // Read the file as text
      reader.readAsText(file);
    });

    // Parse CSV data using PapaParse
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true, // Skip empty lines
    });

    const emailsFromFile = results.data
      .map(row => row["Email Address"]) // Update this to match your CSV header
      .filter(email => validateEmail(email)); // Filter invalid emails

    emailList = emailList.concat(emailsFromFile);
  }

  return emailList;
}

export { readCSV };
