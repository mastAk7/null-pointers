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

// Variables
let method = "";
const login = document.getElementsByClassName("l1")[0];
const signup = document.getElementsByClassName("s1")[0];
const cont = document.getElementsByClassName("cont")[0];

// Function to save user data to Firestore
async function saveUserToFirestore(user) {
    try {
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email.split('@')[0]}`,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        console.log("User data saved to Firestore");
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
    }
}

// Function to close popup
function closePopup() {
    document.querySelector(".login-popup").style.display = "none";
    document.querySelector(".blur-overlay").style.display = "none";
}

// Handle link clicks inside popup
function attachLinkListener() {
    const popInner = document.querySelector(".login-popup p a");
    if (popInner) {
        popInner.addEventListener("click", function (event) {
            event.preventDefault();
            var targetClass = event.target.classList[0];

            if (targetClass === "signup") {
                signup.click();
            } else if (targetClass === "login") {
                login.click();
            }
        });
    }
}

// Login button click
login.addEventListener("click", function() {
    method = "login";
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Welcome Back";
    document.querySelector(".login-popup p").innerHTML = `Don't have an account? <a class="signup" href="#">Sign Up</a>`;
    attachLinkListener();
});

// Signup button click
signup.addEventListener("click", function() {
    method = "signup";
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Create Account";
    document.querySelector(".login-popup p").innerHTML = `Already have an account? <a class="login" href="#">Log In</a>`;
    attachLinkListener();
});

// Continue button click (for email/password auth)
cont.addEventListener("click", function () {
    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    if (method === "signup") {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User created successfully
                const user = userCredential.user;
                alert("Account created successfully!");
                
                // Save user data to Firestore
                saveUserToFirestore(user);
                
                // Close popup
                closePopup();
            })
            .catch((error) => {
                alert("Error: " + error.message);
                console.error("Error Code:", error.code);
            });
    } else if (method === "login") {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User logged in successfully
                const user = userCredential.user;
                
                // Update last login timestamp
                setDoc(doc(db, "users", user.uid), { lastLogin: new Date().toISOString() }, { merge: true });
                
                // Close popup
                closePopup();
                
                alert("Login successful!");
            })
            .catch((error) => {
                alert("Login Failed: " + error.message);
                console.error("Error Code:", error.code);
            });
    }
});

// Google Sign-In callback
async function handleCredentialResponse(response) {
    try {
        // Create a credential with the Google ID token
        const credential = GoogleAuthProvider.credential(response.credential);
        
        // Sign in to Firebase with the Google credential
        const result = await signInWithCredential(auth, credential);
        const user = result.user;
        
        console.log("Google sign-in successful for:", user.email);
        
        // Save user data to Firestore
        await saveUserToFirestore(user);
        
        // Close the popup after a short delay
        setTimeout(() => {
            closePopup();
            // Force close any Google popup that might still be open
            const googlePopups = document.querySelectorAll('div[aria-modal="true"]');
            googlePopups.forEach(popup => {
                popup.style.display = 'none';
            });
            
            // Remove any backdrop or overlay from the Google sign-in
            const backdrops = document.querySelectorAll('.backdrop');
            backdrops.forEach(backdrop => {
                backdrop.style.display = 'none';
            });
        }, 1000);
        
    } catch (error) {
        console.error("Firebase Google Sign-In Error:", error);
        alert("Sign-In Failed: " + error.message);
    }
}

// Toggle user popup
function togglePopup() {
    let popup = document.getElementById("user-popup");
    popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

// Close popup when clicking outside
document.addEventListener("click", function(event) {
    let popup = document.getElementById("user-popup");
    let profilePic = document.getElementById("user-pic");

    if (popup.style.display === "block" && event.target !== popup && event.target !== profilePic) {
        popup.style.display = "none";
    }
});

// Close login popup when clicking on blur overlay
document.querySelector(".blur-overlay").addEventListener("click", function() {
    closePopup();
});

// Update UI with user data
function updateUI(user) {
    if (user) {
        document.getElementById('null-login').classList.add("login-button-dis");
        document.getElementById('null-login').style.display = 'none';
        document.getElementById('user-section').style.display = 'block';

        // Set profile picture
        document.getElementById('user-pic').src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email.split('@')[0]}`;
        
        // Set name and email
        document.getElementById('user-name').innerText = `Hello, ${user.displayName || user.email.split('@')[0]}!`;
        document.getElementById('user-email').innerText = user.email;
        
        // Close popup if it's open after successful authentication
        closePopup();
    } else {
        document.getElementById('null-login').classList.remove("login-button-dis");
        document.getElementById('null-login').style.display = 'flex';
        document.getElementById('user-section').style.display = 'none';
    }
}

// Logout function
function logout() {
    signOut(auth).then(() => {
        // Sign-out successful
        alert("Logged out successfully");
    }).catch((error) => {
        // An error happened
        console.error("Logout error:", error);
    });
}

// Auth state change listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        updateUI(user);
    } else {
        // User is signed out
        updateUI(null);
    }
});

// Expose functions to window object for global access
window.togglePopup = togglePopup;
window.logout = logout;
window.handleCredentialResponse = handleCredentialResponse;