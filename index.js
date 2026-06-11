require('dotenv').config(); // Load variables from .env file
const express = require('express'); // Web framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const axios = require('axios'); // For making HTTP requests to Meta API

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
// express.json() allows us to handle JSON data in our API requests
app.use(express.json());
// bodyParser helps in reading raw bodies which is useful for HMAC verification
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * SERVE FRONTEND
 * This middleare tells Express to serve files from the 'public' folder.
 * When you go to http://localhost:3000, it will look for index.html there.
 */
app.use(express.static('public'));

// BASIC ROUTE
app.get('/', (req, res) => {
    res.send('Instagram Creator Dashboard Backend is Running!');
});

/**
 * WEBHOOK VERIFICATION (GET)
 * This is used by Meta to verify your webhook server.
 * When you add a webhook in Meta Dashboard, they send a challenge.
 */
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

/**
 * WEBHOOK LISTENER (POST)
 * This is where real-time comments and messages will arrive.
 */
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'instagram') {
        body.entry.forEach(entry => {
            // Comments will be inside entry.changes
            if (entry.changes) {
                entry.changes.forEach(change => {
                    console.log('New Comment Event:', change.value);
                });
            }
            
            // Messages will be inside entry.messaging
            if (entry.messaging) {
                entry.messaging.forEach(msg => {
                    console.log('New Message Event:', msg);
                });
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 Set your Meta Webhook callback to: /webhook`);
});
