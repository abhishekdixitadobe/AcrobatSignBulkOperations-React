const express = require("express");
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const app = express();
const path = require("path");
const request = require("request");
require("dotenv").config();
const cors = require("cors");
const { Readable } = require("stream");
const axios = require("axios");
const fs = require("fs");
const querystring = require('querystring');
const mysql = require("mysql2/promise");
const port = process.env.application_port || 3003;
const JSZip = require('jszip');
const application_domain = process.env.application_host || 'localhost';
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const REGEX_PATTERN = /^[^<>:"/\\|?*]*$/;


const CLIENT_ID = process.env.CLIENT_ID; 
const REDIRECT_URI = process.env.REDIRECT_URI; 
const AUTH_BASE_URL = process.env.BASE_URL + '/public/oauth/v2'; 
const SCOPE = process.env.SCOPE;
const OAUTH_TOKEN_URL = process.env.BASE_URL +'/oauth/v2/token';
const OAUTH_REFRESH_TOKEN_URL = process.env.BASE_URL +'/oauth/v2/refresh';



function createApiClient(req) {
  const client = axios.create();
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");

        const { refreshToken } = req.session.tokens || {};
        if (!refreshToken) {
          console.warn("No refresh token found in session. Redirecting to login...");
          return Promise.reject({
            response: {
              status: 401,
              data: { message: "Session expired. Please log in again." },
            },
          });
        }

        try {
          const newTokens = await refreshTokens(refreshToken);
          req.session.tokens = {
            accessToken: newTokens.accessToken,
            accessTokenExpiry: Date.now() + newTokens.expires_in * 1000,
          };
          req.session.save();

          error.config.headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
          return client.request(error.config); // Retry original request
        } catch (refreshError) {
          console.error("Error refreshing tokens:", refreshError.message);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}



async function refreshTokens(refreshToken) {
  try {
    const response = await axios.post(
      OAUTH_REFRESH_TOKEN_URL,
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: process.env.client_secret,
        refresh_token: refreshToken, // Use stored refresh token
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("refreshTokens---response---",response);
    return {
      accessToken: response.data.access_token
    };
  } catch (error) {
    console.error("Error refreshing tokens", error);
    throw new Error("Failed to refresh tokens");
  }
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);


// Serve static React files
const staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));


const ADOBE_SIGN_BASE_URL = process.env.BASE_URL + "/api/rest/v6/"; // 'https://api.in1.adobesign.com:443/api/rest/v6/';
const initializeDb = process.env.INITIALIZE_DB === 'true'; 

// SSL
const https = require("https");

const options = {
  key: fs.readFileSync("./dev/certs/server.key"),
  cert: fs.readFileSync("./dev/certs/server.crt"),
};

// Define the storage for uploaded files
const multer = require("multer");
const storage = multer.memoryStorage(); // Use in-memory storage
const upload = multer({ storage });
const sharp = require("sharp");

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const STATIC_ASSETS_PATH = path.resolve(__dirname, "../static");

app.use(express.static(STATIC_ASSETS_PATH));

let db; // Variable to hold the database connection


/// Create a logger with daily rotation
const logger = winston.createLogger({
  level: 'info', // Set log level to 'info'
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log', // Log file name pattern
      datePattern: 'YYYY-MM-DD-HH',    // Log rotation every hour
      zippedArchive: true,             // Compress old logs
      maxSize: '10m',                  // Maximum size of a log file before rotation
      maxFiles: '30d',                 // Keep logs for 30 days
    }),
    new winston.transports.Console({ // Log to console as well
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
  ],
});


async function initializeDbConnection() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "aabbhhii",
      database: process.env.DB_NAME || "bulk_operation_tool",
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}
console.log("initializeDb:", initializeDb);
console.log("INITIALIZE_DB:", process.env.INITIALIZE_DB);

if (initializeDb) {
  console.log("Initializing database connection...");
  initializeDbConnection().catch(error => {
    console.error("Database initialization failed:", error);
  });
}


// Express Session
const session = require("express-session");
const isProduction = true;
app.use(session({
    name: "sessionID",
    secret: "abc", // Use a more secure secret in production!
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: isProduction, // Secure cookies only over HTTPS in production
      httpOnly: true, // Prevents client-side JavaScript access to cookies
      maxAge: 1000 * 60 * 60 * 24, // Optional: 1 day cookie expiration
    },
  })
);

// logging
const { log, clearLog } = require("./logging/logger");
const logRoute = require("./logging/logRoute");
app.use((req, res, next) => {
  if (req.session) {
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // Extend session expiration
  }
  next();
});
/*
app.use(logRoute);

// Middleware to add a logger to the request object
app.use((req, res, next) => {
  const sessionId = req.sessionID;
  req.logger = {
    log: (level, message) => {
      log(sessionId, level, message);
    },
    clear: () => {
      clearLog(sessionId);
    },
  };
  next();
});
*/

// get sessionID
app.get("/api/session", (req, res) => {
  req.logger.log("info", "Initializing...");
  res.send({ sessionID: req.sessionID });
});
app.get('/api/auth-url', (req, res) => {
  console.log('inside /auth-url---------------');
  console.log('SCOPE',SCOPE);
  console.log('AUTH_BASE_URL',AUTH_BASE_URL);
  const state = req.query.state || ''; // Optional: Pass state parameter for CSRF protection
  const scope = SCOPE; // Define required scopes
  const authUrl = `${AUTH_BASE_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
  
  res.redirect(authUrl);
});
app.get("*", (req, res) => {
  res.sendFile(path.join(STATIC_ASSETS_PATH, "index.html"));
});

// Define the /callback route
app.get('/callback', (req, res) => {
  res.sendFile(path.join(STATIC_ASSETS_PATH, "index.html")); // Serve your main HTML file
});
function convertToISO8601(dateObj) {
  const { year, month, day } = dateObj;

  // JavaScript's Date uses a 0-based index for months (0 = January, 11 = December)
  const date = new Date(year, month - 1, day);

  // Convert to ISO-8601 string (format: YYYY-MM-DDTHH:mm:ss.sssZ)
  //const isoDateString = date.toISOString();
  console.log("date::::::::",dateObj);
  return dateObj;
}

async function checkSession(req, res){
  if (!req.session.tokens || !req.session.tokens.accessToken) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  const isTokenExpired = (req) => {
    const { accessTokenExpiry } = req.session.tokens || {};
    return !accessTokenExpiry || Date.now() >= accessTokenExpiry;
  };

  if (isTokenExpired(req)) {
    console.log("Access token expired, refreshing before starting...");
    const newTokens = await refreshTokens(req.session.tokens.refreshToken);
    req.session.tokens = {
      accessToken: newTokens.accessToken,
      refreshToken: req.session.tokens.refreshToken,
      accessTokenExpiry: Date.now() + newTokens.expires_in * 1000,
    };
    req.session.save();
  }
}
app.post('/api/download-auditReport', async (req, res) => {

  const { ids } = req.body;
  const zip = new JSZip();
  const apiClient = createApiClient(req);
  try {
    const files = await Promise.all(
      ids.map(async (id) => {
        const endpoint = `${ADOBE_SIGN_BASE_URL}agreements/${id}/auditTrail`;
        console.log("download audit report endpoint::",endpoint);
        const response = await apiClient.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${req.session.tokens.accessToken}`, // Use the session token
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Required for binary data
        });
        const filename = `auditTrail_${id}.csv`; 
        zip.file(filename, response.data, { binary: true });

        return { filename, fileData: response.data.toString('base64') };

      })
    );
    const userId = req.session.userId;
    const userEmail = req.session.userEmail;
    logger.info('User Activity', {
      userId: userId,
      email: userEmail,
      action: 'Download Audit Report',
    });
    // Send as zip file
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="auditReport.zip"'
    });
    res.send(content);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Failed to fetch files." });
  }

});

app.post('/api/download-formfields', async (req, res) => {

  const { ids } = req.body;
  const zip = new JSZip();
  const apiClient = createApiClient(req);
  try {
    const files = await Promise.all(
      ids.map(async (id) => {
        const endpoint = `${ADOBE_SIGN_BASE_URL}agreements/${id}/formData`;
        console.log("download formfields endpoint::",endpoint);
        const response = await apiClient.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${req.session.tokens.accessToken}`, // Use the session token
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Required for binary data
        });
        const filename = `agreement_${id}.csv`; 
        zip.file(filename, response.data, { binary: true });

        return { filename, fileData: response.data.toString('base64') };

      })
    );
    const userId = req.session.userId;
    const userEmail = req.session.userEmail;
    logger.info('User Activity', {
      userId: userId,
      email: userEmail,
      action: 'Download Form Fields',
    });
    // Send as zip file
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="formfields.zip"'
    });
    res.send(content);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Failed to fetch files." });
  }

});

app.post('/api/download-agreements', async (req, res) => {

    const { ids } = req.body;
    const zip = new JSZip();
    const apiClient = createApiClient(req);
    try {
      const files = await Promise.all(
        ids.map(async (id) => {
          const endpoint = `${ADOBE_SIGN_BASE_URL}agreements/${id}/combinedDocument`;
          console.log("download endpoint::",endpoint);
          const response = await apiClient.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${req.session.tokens.accessToken}`, // Use the session token
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer', // Required for binary data
          });
          const filename = `agreement_${id}.pdf`; // Name the file as needed
          zip.file(filename, response.data, { binary: true });

          return { filename, fileData: response.data.toString('base64') };

        })
      );
      const userId = req.session.userId;
      const userEmail = req.session.userEmail;
      logger.info('User Activity', {
        userId: userId,
        email: userEmail,
        action: 'Download Agreements',
      });
      // Send as zip file
      const content = await zip.generateAsync({ type: 'nodebuffer' });
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="agreements.zip"'
      });
      res.send(content);
    } catch (error) {
      console.error("Error fetching files:", error.message);
      res.status(500).json({ error: "Failed to fetch files." });
    }

});

app.post('/api/download-templateFormfields', async (req, res) => {

  const { ids } = req.body;
  const zip = new JSZip();
  const apiClient = createApiClient(req);
  try {
    const files = await Promise.all(
      ids.map(async (id) => {
        const endpoint = `${ADOBE_SIGN_BASE_URL}libraryDocuments/${id}/formData`;
        console.log("template download formfields endpoint::",endpoint);
        const response = await apiClient.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${req.session.tokens.accessToken}`, // Use the session token
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Required for binary data
        });
        const filename = `template_${id}.csv`; 
        zip.file(filename, response.data, { binary: true });

        return { filename, fileData: response.data.toString('base64') };

      })
    );

    // Send as zip file
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="formfields.zip"'
    });
    res.send(content);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Failed to fetch files." });
  }

});

app.post('/api/download-templateDocument', async (req, res) => {

  const { ids } = req.body;
  const zip = new JSZip();
  const apiClient = createApiClient(req);
  try {
    const files = await Promise.all(
      ids.map(async (id) => {
        const endpoint = `${ADOBE_SIGN_BASE_URL}libraryDocuments/${id}/combinedDocument`;
        console.log("template download endpoint::",endpoint);
        const response = await apiClient.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${req.session.tokens.accessToken}`, // Use the session token
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Required for binary data
        });
        const filename = `template_${id}.pdf`; // Name the file as needed
        zip.file(filename, response.data, { binary: true });

        return { filename, fileData: response.data.toString('base64') };

      })
    );

    // Send as zip file
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="agreements.zip"'
    });
    res.send(content);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Failed to fetch files." });
  }

});

app.post('/api/search', async (req, res) => { 
  console.log('Inside api/search');  

  try {
    
    await checkSession(req, res);

    let allResults = [];
    let startIndex = 0;
    let hasNext = true;
    const { startDate, endDate, email, selectedStatuses } = req.body;
    const isoStartDate = convertToISO8601(startDate);
    const isoEndDate = convertToISO8601(endDate);
    const searchEndpoint = ADOBE_SIGN_BASE_URL + 'search';

    const apiClient = createApiClient(req);

    while (hasNext) {
      console.log("Session tokens at iteration:", JSON.stringify(req.session.tokens));
      try {
        const response = await apiClient.post(
          searchEndpoint,
          {
            scope: ["AGREEMENT_ASSETS"],
            agreementAssetsCriteria: {
              modifiedDate: {
                range: { gt: isoStartDate, lt: isoEndDate },
              },
              pageSize: 50,
              startIndex: startIndex,
              status: selectedStatuses,
              type: ["AGREEMENT"],
              visibility: "SHOW_ALL",
            },
          },
          {
            headers: {
              'x-api-user': `email:${email}`,
              'Authorization': `Bearer ${req.session.tokens.accessToken}`
            },
          }
        );

        allResults = allResults.concat(response.data.agreementAssetsResults.agreementAssetsResultList);
        const nextIndex = response.data.agreementAssetsResults.searchPageInfo.nextIndex;
        hasNext = nextIndex !== null;

        if (hasNext) {
          startIndex = nextIndex;
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("Token expired and could not be refreshed.");
          break;
        }
        throw error;
      }
    }

    const userId = req.session.userId;
    const userEmail = req.session.userEmail;
    logger.info('User Activity', { userId, email: userEmail, action: 'Agreement Search' });

    res.json({ totalResults: allResults.length, agreementAssetsResults: allResults });
  } catch (error) {
    console.error('Search request failed', error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post('/api/libraryDocuments', async (req, res) => {
  try {
    let allResults = []; // Array to store all results
    let startIndex = ''; // Start index for pagination
    let hasNext = true;  // Flag to control the loop
    await checkSession(req, res);
    const apiClient = createApiClient(req);
    while (hasNext) {
      let libraryDocumentsEndpoint = `${ADOBE_SIGN_BASE_URL}libraryDocuments?showHiddenLibraryDocuments=true&includeSharees=true`;
      if (startIndex !== '') {
        libraryDocumentsEndpoint += `&cursor=${startIndex}`;
      }
      console.log("libraryDocumentsEndpoint----", libraryDocumentsEndpoint);

      const response = await apiClient.get(libraryDocumentsEndpoint, {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${req.session.tokens.accessToken}`
        },
      });

      console.log("response.data-------------", response.data);
      allResults = allResults.concat(response.data.libraryDocumentList);

      // Check for next index
      const nextIndex = response.data.page.nextCursor;
      console.log("response.data.page------", response.data.page);
      console.log("nextIndex------", nextIndex);
      hasNext = (nextIndex !== undefined);

      if (hasNext) {
        startIndex = nextIndex; // Update startIndex for the next iteration
      }
    }

    // Return all collected results
    res.json({ totalResults: allResults.length, libraryDocuments: allResults });
  } catch (error) {
    console.error('Error fetching library documents:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch library documents' });
  }
});

app.post('/api/widgets', async (req, res) => {
  
  try {
    let allResults = []; // Array to store all results
    let startIndex = '';  // Start index for pagination
    let hasNext = true;   // Flag to control the loop
    
    const apiClient = createApiClient(req);
    while (hasNext) {
      let widgetsEndpoint = ADOBE_SIGN_BASE_URL + 'widgets?showHiddenWidgets=true';
      
      if(startIndex !== ''){
        widgetsEndpoint = ADOBE_SIGN_BASE_URL + 'libraryDocuments?showHiddenWidgets=true&cursor='+startIndex;
      }
      console.log("widgetsEndpoint----",widgetsEndpoint);
      const response = await apiClient.get(
        widgetsEndpoint,
        {
          headers: {
            'Authorization': req.headers['authorization'],  
            'Content-Type': 'application/json',
          },
        }
      );
    
      console.log("response.data-------------", response.data);
      allResults = allResults.concat(response.data.userWidgetList); 

      // Check for next index
      const nextIndex = response.data.page.nextCursor;
      console.log("response.data.page------",response.data.page);
      console.log("nextIndex------",nextIndex);
      hasNext = (nextIndex !== undefined); 

      if (hasNext) {
        startIndex = nextIndex; // Update startIndex for the next iteration
      }

    } 
    // Return all collected results
    res.json({ totalResults: allResults.length, userWidgetList: allResults });
    
  } catch (error) {
    console.error('Token exchange failed', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.post('/api/widgets-agreements', async (req, res) => {
  try {
    const { ids } = req.body; // Get IDs from the request body
    let allResults = []; // Array to store all results
    const apiClient = createApiClient(req);
    // Fetch agreements for each widget ID
    const files = await Promise.all(
      ids.map(async (id) => {
        let hasNext = true;
        let startIndex = '';

        while (hasNext) {
          // Construct the widgets endpoint dynamically
          let widgetsEndpoint = `${ADOBE_SIGN_BASE_URL}widgets/${id}/agreements`;
          if (startIndex) {
            widgetsEndpoint += `?cursor=${startIndex}`;
          }

          console.log("Fetching agreements from:", widgetsEndpoint);

          const response = await apiClient.get(widgetsEndpoint, {
            headers: {
              'Authorization': req.headers['authorization'],
              'Content-Type': 'application/json',
            },
          });

          console.log("Response data:", response.data);

          // Collect agreements
          allResults = allResults.concat(response.data.userAgreementList);

          // Check for nextCursor to continue pagination
          const nextIndex = response.data.page?.nextCursor;
          hasNext = !!nextIndex; // Update hasNext based on nextCursor
          startIndex = nextIndex || ''; // Update startIndex for the next iteration
        }
      })
    );

    // Return all collected results
    res.json({ totalResults: allResults.length, userAgreementList: allResults });
  } catch (error) {
    console.error('Error fetching widget agreements:', error);
    res.status(500).json({ error: 'Failed to fetch widget agreements' });
  }
});


app.post('/api/workflows', async (req, res) => {
  const workflowsEndpoint = ADOBE_SIGN_BASE_URL + 'workflows?includeDraftWorkflows=false&includeInactiveWorkflows=false';
  try {
    let allResults = []; // Array to store all results
    let startIndex = 0;  // Start index for pagination
    let hasNext = true;   // Flag to control the loop

      const response = await axios.get(
        workflowsEndpoint,
        {
          headers: {
            'Authorization': req.headers['authorization'],  
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("response.data-------------", response.data);
      allResults = response.data.userWorkflowList; // Collect results


    // Return all collected results
    res.json({ totalResults: allResults.length, userWorkflowList: allResults });
    
  } catch (error) {
    console.error('Token exchange failed', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});
app.post('/api/exchange-token', async (req, res) => {
  console.log("inside -/api/exchange-token-----");
  const { authCode } = req.body;
  if (!authCode) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const response = await axios.post(
      OAUTH_TOKEN_URL,
      querystring.stringify({
        "client_id": CLIENT_ID,
        "client_secret": process.env.client_secret,
        "code": authCode,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('refresh_token-----',response.data.refresh_token);
    req.session.tokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
    req.session.save((err) => {
      if (err) console.error("Session save error:", err);
    });
    const userUrl = ADOBE_SIGN_BASE_URL + 'users/me' ;
    console.log("userUrl--------",userUrl);
    console.log("response.data.access_token--------",response.data.access_token);
    const userData = await axios.get(userUrl, {
        headers: {
          'Authorization': 'Bearer '+response.data.access_token,
        },
      }
    );
    // Send the access token back to the client
    console.log("response.data---------",response.data);
    console.log("userData.data---------",userData.data);
    const userId = userData.data.id;
    const email = userData.data.email;
    const loginTime = new Date();
    const ipAddress = req.ip;
    const device = req.headers['user-agent'];

    // Store user info in session
    req.session.userId = userId;
    req.session.userEmail = email;
    // Example log
    logger.info('User login', {
      userId: userData.data.id,
      email: userData.data.email,
      loginTime: loginTime,
      action: 'Login',
    });
    if(initializeDb){
        await db.execute(
          'INSERT INTO user_logins (user_id, login_time, ip_address, device, email) VALUES (?, ?, ?, ?,?)',
          [userId, loginTime, ipAddress, device, email]
        );
    }else{
      logger.info('User login', {
        userId: userData.data.id,
        email: userData.data.email,
        loginTime: loginTime,
        action: 'Login',
      });
    }

    const resData = {
      "authData": response.data,
      "userData": userData.data 
    }
    res.json(resData);
  } catch (error) {
    console.error('Token exchange failed', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.post('/api/integration-token', async (req, res) => {
  try {
    const integrationKey = process.env.INTEGRATION_KEY;
    req.session.tokens = {
      accessToken: integrationKey,
    };
    const userUrl = ADOBE_SIGN_BASE_URL + 'users/me' ;
    console.log("userUrl--------",userUrl);
    const userData = await axios.get(userUrl, {
        headers: {
          'Authorization': 'Bearer '+integrationKey,
        },
      }
    );
    // Send the access token back to the client
    console.log("userData.data---------",userData.data);
    const userId = userData.data.id;
    const email = userData.data.email;
    const loginTime = new Date();
    const ipAddress = req.ip;
    const device = req.headers['user-agent'];

    // Store user info in session
    req.session.userId = userId;
    req.session.userEmail = email;
    // Example log
    logger.info('User login', {
      userId: userData.data.id,
      email: userData.data.email,
      loginTime: loginTime,
      action: 'Login',
    });
    if(initializeDb){
        await db.execute(
          'INSERT INTO user_logins (user_id, login_time, ip_address, device, email) VALUES (?, ?, ?, ?,?)',
          [userId, loginTime, ipAddress, device, email]
        );
    }else{
      logger.info('User login', {
        userId: userData.data.id,
        email: userData.data.email,
        loginTime: loginTime,
        action: 'Login',
      });
    }

    const resData = {
      "authData": integrationKey,
      "userData": userData.data 
    }
    res.json(resData);
  } catch (error) {
    console.error('Token exchange failed', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

function requireSession(req, res, next) {
  if (req.path === "/auth-url") {
    return next();
  }
  if (!req.session || !req.session.tokens) {
    return res.status(401).json({ error: "Session expired. Please log in." });
  }
  next();
}
app.use("/api", requireSession);

// Start the server
const server = https.createServer(options, app);
server.listen(port, () => {
  console.log(`Proxy server listening at https://${application_domain}:${port}`);
});

