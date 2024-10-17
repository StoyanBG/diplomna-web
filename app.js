const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database(); // Initialize Firebase Realtime Database

const app = express();

// Middleware for parsing JSON body
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if the user is authenticated
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Store user information in request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

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
    // For login, return a custom token or perform other necessary steps
    // Here, you should authenticate the user using the Firebase client SDK
    res.json({ message: 'User logged in successfully', userId: user.uid });
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid credentials' });
  }
});

// Route for checking user authentication
app.get('/check-auth', authenticateUser, (req, res) => {
  res.json({ isAuthenticated: true, userId: req.user.uid }); // Return user ID or any relevant user info
});

// Route for saving user choices
app.post('/save-choice', authenticateUser, (req, res) => {
  const { lineIds } = req.body;
  const userId = req.user.uid; // Use user ID from token

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

// Route for fetching selected lines
app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.user.uid; // Use user ID from token

  try {
    const snapshot = await db.ref('choices/' + userId).once('value');
    const choices = snapshot.val() || {};
    const lineIds = Object.values(choices).map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching complaints
app.get('/get-complaints', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('messages').orderByChild('receiver').equalTo('admin').once('value');
    const messages = snapshot.val() || {};

    const complaints = await Promise.all(
      Object.entries(messages).map(async ([id, messageData]) => {
        const senderSnapshot = await db.ref('users/' + messageData.sender).once('value');
        const senderData = senderSnapshot.val() || {};
        
        const responses = messageData.responses || {};
        const responsesWithNames = await Promise.all(
          Object.entries(responses).map(async ([resId, resData]) => {
            const responderSnapshot = await db.ref('users/' + resData.responder).once('value');
            const responderData = responderSnapshot.val() || {};
            return {
              ...resData,
              responderName: responderData.name
            };
          })
        );

        return {
          id,
          subject: messageData.subject,
          message: messageData.message,
          sender: senderData.name || 'Unknown',
          responses: responsesWithNames
        };
      })
    );

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for sending a message
app.post('/send-message', authenticateUser, async (req, res) => {
  const { subject, message } = req.body;
  const sender = req.user.uid; // Use user ID from token

  try {
    await db.ref('messages').push({
      sender,
      receiver: 'admin',
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    res.status(200).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route for responding to a message
app.post('/respond-message', authenticateUser, async (req, res) => {
  const { messageId, response } = req.body;
  const responder = req.user.uid; // Use user ID from token

  try {
    const messageRef = db.ref('messages/' + messageId);
    const messageSnapshot = await messageRef.once('value');

    if (!messageSnapshot.exists()) {
      return res.status(404).send('Message not found');
    }

    await messageRef.child('responses').push({
      responder,
      response_message: response,
      createdAt: new Date().toISOString(),
    });

    res.status(200).send('Response sent successfully');
  } catch (error) {
    console.error('Error responding to message:', error);
    res.status(500).send('Server error');
  }
});

module.exports = app;
