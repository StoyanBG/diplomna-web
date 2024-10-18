const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors'); // Import CORS

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \n with actual new line
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.database(); // Initialize Firebase Realtime Database

const app = express();

// CORS middleware
app.use(cors({
  origin: '*', // Allow all origins for now (you can restrict it to specific domains)
  credentials: true // Enable if you want to allow cookies or authorization headers
}));

// Middleware for parsing JSON body
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await db.ref('users/' + userRecord.uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    res.json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    // Since Firebase does not support password verification on the server,
    // The client should authenticate using Firebase Authentication SDK.
    const customToken = await admin.auth().createCustomToken(userRecord.uid); // Create a custom token
    res.json({ message: 'User logged in successfully', token: customToken }); // Return the custom token
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid credentials' });
  }
});

// Middleware to check if the user is authenticated
async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid; // Store user ID for later use
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Route for checking user authentication
app.get('/check-auth', authenticateUser, (req, res) => {
  res.json({ isAuthenticated: true }); // User is authenticated
});

// Route for saving user choices
app.post('/save-choice', authenticateUser, async (req, res) => {
  const { lineIds } = req.body;
  const userId = req.userId; // Use the authenticated user ID

  try {
    const userChoicesRef = db.ref('choices/' + userId);
    const promises = lineIds.map(lineId => userChoicesRef.push({ lineId })); // Create an array of promises
    await Promise.all(promises); // Wait for all write operations to complete
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching selected lines
app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.userId;

  try {
    const snapshot = await db.ref('choices/' + userId).once('value');
    const choices = snapshot.val() || {};
    const lineIds = Object.values(choices).map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
