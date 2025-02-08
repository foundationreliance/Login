import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDN92MjC4k2pzBD8wgc3ADy8qQvqKElUyM",
    authDomain: "login-1b560.firebaseapp.com",
    projectId: "login-1b560",
    storageBucket: "login-1b560.firebasestorage.app",
    messagingSenderId: "231863683041",
    appId: "1:231863683041:web:aea7cf73438119acc0f4a0",
    measurementId: "G-62ETK5W9R3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to log in a user and send data to the server
const loginUser = async (email, password, phone) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Prepare user data
        const userData = {
            email: email,
            phone: phone,
            loginTime: new Date().toISOString()
        };

        console.log("📤 Sending data to server:", userData);

        // Send data to local Node.js server
        const response = await fetch("http://localhost:3000/saveUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log("✅ Server Response:", result);

        alert("Login successful! Data saved locally and in Firestore.");
        return user;
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        alert(error.message);
    }
};

// Export function
export { loginUser };
