const fs = require('fs');
const admin = require('firebase-admin');

// Load Firebase Admin credentials (replace with your actual path)
const serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Path to save JSON file locally
const FILE_PATH = "./userData.json";

// Function to save user data as JSON
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

// Expose function for external use
module.exports = { saveUserData };
