const fs = require('fs');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Load Firebase Admin credentials (replace with your actual path)
const serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors());

// Path to save JSON file locally
const FILE_PATH = "./userData.json";

// Function to save user data locally
function saveUserData(userData) {
    let existingData = [];

    // Check if file exists, then read existing data
    if (fs.existsSync(FILE_PATH)) {
        const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
        existingData = JSON.parse(fileContent);
    }

    // Add new user data
    existingData.push(userData);

    // Write updated data back to JSON file
    fs.writeFileSync(FILE_PATH, JSON.stringify(existingData, null, 4));

    console.log("User data saved to userData.json");
}

// Function to upload data to Firestore
async function saveToFirestore(userData) {
    try {
        const docRef = db.collection('users').doc(userData.email);
        await docRef.set(userData);
        console.log("User data uploaded to Firestore");
    } catch (error) {
        console.error("Error uploading to Firestore:", error);
    }
}

// API Endpoint to Save Data
app.post('/saveUser', async (req, res) => {
    console.log("Received Data:", req.body);
    const userData = req.body;
    
    saveUserData(userData);  // Save locally
    await saveToFirestore(userData); // Upload to Firestore

    res.send({ message: "User data saved locally and uploaded to Firestore!" });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
