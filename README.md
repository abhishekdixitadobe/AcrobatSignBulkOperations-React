## Acrobat Sign Bulk Operations Tool

The Acrobat Sign Bulk Operations Tool is a standalone React-based web application designed to streamline bulk operations for Account and Group administrators. This robust tool enables efficient execution of tasks such as deleting agreements, downloading agreements and form fields, and hiding agreements. Tailored specifically for administrators, it simplifies large-scale agreement management with optimized workflows.

### Environment Setup

1. Install [NodeJS](https://nodejs.org/en).
2. Install [Git Command line](https://git-scm.com/downloads) (Optional)
3. A .env_example is provided. You will need to rename to .env and enter the information (api keys, etc.)

### Get the latest build and install dependencies

Perform these steps using a terminal (or Command line in Windows):

1. Create a root folder where you want this project to live.
2. cd to the root folder you just created.
3. At a command line, run this git command:
   `git clone https://github.com/abhishekdixitadobe/AcrobatSignBulkOperations-React.git`
           ## OR
   You can also download the package is zip and unzip the project.
4. Navigate to the project root: `cd api-code-sandbox-react`
5. Run `npm install`. This will install all of the necessary dependencies.

### Configuring OAuth
<ul>
   <li> Please follow the steps mentioned in the link below to get the Client Id and Client Secret values.  https://opensource.adobe.com/acrobat-sign/developer_guide/gstarted.html</li>
   <li> Redirect URL: Please use https://localhost:3000</li>
   <li> Update the CLIENT_ID, client_secret, REDIRECT_URI, SCOPE, AUTH_URL and OAUTH_TOKEN_URL in the .env file. </li>
</ul>

### Run the app

Paste this command in terminal / command line: `npm start`
Please go to the browser and run the application with the URL: https://localhost:3000

### Terminating the app

`ctrl-c`

## Key Features:
#### 1. Bulk Operations:
  <ul>
    <li>
      Delete: Seamlessly remove documents associated with agreements in bulk.
    </li>
      <li>
        Download: Easily retrieve agreements and their associated form fields in bulk.
      </li>
      <li>
        Hide: Quickly conceal all agreements for enhanced organization and management.
      </li>
    <li>
        Cancel Agreements: Cancel In-Progress agreements in bulk.
      </li>
     <li>
        Cancel reminders: Cancel reminders in bulk.
      </li>
      <li>
        Audit reports: Download audit reports in bulk.
      </li>
  </ul>

#### 2. Advanced filtering:
  <ul>
  <li>
    Date Range Filtering: Fetch agreements based on specific date ranges, allowing for targeted retrieval of desired records.
  </li>
  <li>
    Agreement Status Filtering: Filter agreements based on their status, enabling quick access to agreements in specific states (e.g., completed, pending).
  </li>
  <li>
    Role-Based Fetching: Fetch agreements based on assigned roles, simplifying the process of retrieving agreements associated with specific users or groups.
  </li>
  </ul>

#### 3. Download library templates form fields:
  <ul>
  <li>
    With this capability, users can retrieve and download library templates and their associated form fields directly from within the bulk operations tool. Users can also hide the library templates in bulk.
  </li>
</ul>

#### 4. Webform-Associated Agreements Retrieval:
  <ul>
  <li>
    Users can now access a list of created webforms and subsequently retrieve associated agreements to perform bulk operations (download agreements/form fields etc.).
  </li>
</ul>

### Delete Operation
The delete operation is available to delete the documents associated with agreements. To enable the delete operation, please raise the support ticket and sign the retention policy with enable "agreement_retention" flag.
<br>

![image](https://github.com/abhishekdixitadobe/AcrobatSignBulkOperations/assets/93244386/b0cf89cd-0b3f-43c5-ab65-51f81badf6c3)
