// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithCredential,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkl3iA_4CIBC9LOGaivdtkvk1NnfKfDJI",
    authDomain: "fraud-eye.firebaseapp.com",
    projectId: "fraud-eye",
    storageBucket: "fraud-eye.appspot.com",
    messagingSenderId: "535813163862",
    appId: "1:535813163862:web:94a74fd9f61d5dde2da4f7"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Backend API URL (Replace with your actual ngrok URL)
const apiUrl = "https://0ccf-34-125-27-184.ngrok-free.app";

// Submit a transaction for fraud detection
async function submitTransaction(transactionData) {
    try {
        const response = await fetch(${apiUrl}/fraud-detection, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
        });

        const result = await response.json();
        console.log("Fraud Detection Result:", result);

        // Display result in UI
        document.getElementById("fraud-result").innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error("Error detecting fraud:", error);
    }
}

// Report a fraud case manually
async function reportFraud(transactionId, isFraud, reason) {
    try {
        const response = await fetch(${apiUrl}/report-fraud, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                transaction_id: transactionId,
                is_fraud: isFraud,
                reason: reason
            }),
        });

        const result = await response.json();
        console.log("Fraud Report Submitted:", result);
        alert("Fraud report updated successfully!");
    } catch (error) {
        console.error("Error reporting fraud:", error);
    }
}

// Fetch all fraud reports
async function fetchFraudReports() {
    try {
        const response = await fetch(${apiUrl}/view-reports);
        const data = await response.json();
        console.log("Fraud Reports:", data);

        // Display reports in UI
        document.getElementById("fraud-reports").innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Error fetching fraud reports:", error);
    }
}

// UI Integration - Example event listeners (Modify based on your actual UI elements)
document.getElementById("submit-transaction-btn").addEventListener("click", () => {
    const transactionData = {
        transaction_id: document.getElementById("transaction-id").value,
        amount: parseFloat(document.getElementById("amount").value),
        payer_id: document.getElementById("payer-id").value,
        payee_id: document.getElementById("payee-id").value,
        transaction_channel: document.getElementById("transaction-channel").value,
        payment_mode: document.getElementById("payment-mode").value
    };
    submitTransaction(transactionData);
});

document.getElementById("report-fraud-btn").addEventListener("click", () => {
    const transactionId = document.getElementById("report-transaction-id").value;
    const isFraud = document.getElementById("report-is-fraud").checked;
    const reason = document.getElementById("report-reason").value;
    reportFraud(transactionId, isFraud, reason);
});

document.getElementById("view-reports-btn").addEventListener("click", fetchFraudReports);

// User Authentication UI Updates
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('null-login').style.display = 'none';
        document.getElementById('user-section').style.display = 'block';
        document.getElementById('user-pic').src = user.photoURL || https://ui-avatars.com/api/?name=${user.displayName || user.email.split('@')[0]};
        document.getElementById('user-name').innerText = Hello, ${user.displayName || user.email.split('@')[0]}!;
        document.getElementById('user-email').innerText = user.email;
    } else {
        document.getElementById('null-login').style.display = 'flex';
        document.getElementById('user-section').style.display = 'none';
    }
});

// Logout Function
function logout() {
    signOut(auth).then(() => {
        alert("Logged out successfully");
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

// Expose functions globally for UI access
window.logout = logout;
window.submitTransaction = submitTransaction;
window.reportFraud = reportFraud;
window.fetchFraudReports = fetchFraudReports;