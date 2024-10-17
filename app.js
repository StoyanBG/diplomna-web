const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

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
    const user = await admin.auth().getUserByEmail(email);
    // Assuming the user is authenticated on the client-side and you received a token
    res.json({ message: 'User logged in successfully', userId: user.uid });
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid credentials' });
  }
});

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  // Token-based auth logic should replace session-based logic
  next(); // For now, continue without checking authentication
}

// Route for checking user authentication
app.get('/check-auth', (req, res) => {
  res.json({ isAuthenticated: true }); // Dummy response for now
});

app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.session.userId;

  try {
    const snapshot = await db.ref('choices/' + userId).once('value');
    const choices = snapshot.val() || {};
    const lineIds = Object.values(choices).map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route for saving user choices
app.post('/save-choice', authenticateUser, (req, res) => {
  const { lineIds } = req.body;
  const userId = req.session.userId;

  try {
    const userChoicesRef = db.ref('choices/' + userId);
    lineIds.forEach(lineId => {
      userChoicesRef.push({ lineId });
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
