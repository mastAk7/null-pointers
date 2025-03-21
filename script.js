// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithCredential 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase configuration - using your existing config
const firebaseConfig = {
    apiKey: "AIzaSyBkl3iA_4CIBC9LOGaivdtkvk1NnfKfDJI",
    authDomain: "fraud-eye.firebaseapp.com",
    projectId: "fraud-eye",
    storageBucket: "fraud-eye.appspot.com",
    messagingSenderId: "535813163862",
    appId: "1:535813163862:web:94a74fd9f61d5dde2da4f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Variables
let method = "";
const login = document.getElementsByClassName("l1")[0];
const signup = document.getElementsByClassName("s1")[0];
const cont = document.getElementsByClassName("cont")[0];

// Handle link clicks inside popup
function attachLinkListener() {
    const popInner = document.querySelector(".login-popup p a");
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

// Login button click
login.addEventListener("click", function() {
    method = "login";
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Welcome Back";
    document.querySelector(".login-popup p").innerHTML = `Don't have an account? <a class="signup">Sign Up</a>`;
    attachLinkListener();
});

// Signup button click
signup.addEventListener("click", function() {
    method = "signup";
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Create Account";
    document.querySelector(".login-popup p").innerHTML = `Already have an account? <a class="login">Log In</a>`;
    attachLinkListener();
});

// Continue button click (for email/password auth)
cont.addEventListener("click", function () {
    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    if (method === "signup") {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Account created successfully!");
                
                // Store minimal user info
                const userData = {
                    name: email.split('@')[0], // Use part before @ as name
                    email: email,
                    picture: "https://ui-avatars.com/api/?name=" + email.split('@')[0] // Default avatar
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                document.querySelector(".login-popup").style.display = "none";
                document.querySelector(".blur-overlay").style.display = "none";
                updateUI(userData);
            })
            .catch((error) => {
                alert("Error: " + error.message);
                console.error("Error Code:", error.code);
            });
    } else if (method === "login") {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Store minimal user info
                const userData = {
                    name: email.split('@')[0], // Use part before @ as name
                    email: email,
                    picture: "https://ui-avatars.com/api/?name=" + email.split('@')[0] // Default avatar
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                document.querySelector(".login-popup").style.display = "none";
                document.querySelector(".blur-overlay").style.display = "none";
                updateUI(userData);
                alert("Login successful!");
            })
            .catch((error) => {
                alert("Login Failed: " + error.message);
                console.error("Error Code:", error.code);
            });
    }
});

// Google Sign-In callback
function handleCredentialResponse(response) {
    // Get credential from Google Sign-In response
    const credential = GoogleAuthProvider.credential(response.credential);
    
    // Sign in to Firebase with the Google credential
    signInWithCredential(auth, credential)
        .then((result) => {
            // Get user info from Firebase user
            const user = result.user;
            
            // Create userData object from Firebase user
            const userData = {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                picture: user.photoURL || "https://ui-avatars.com/api/?name=" + user.email.split('@')[0]
            };
            
            // Store user data and update UI
            localStorage.setItem('user', JSON.stringify(userData));
            document.querySelector(".login-popup").style.display = "none";
            document.querySelector(".blur-overlay").style.display = "none";
            updateUI(userData);
        })
        .catch((error) => {
            console.error("Firebase Google Sign-In Error:", error);
            alert("Sign-In Failed: " + error.message);
        });
}

// Function to decode JWT token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
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

// Update UI with user data
function updateUI(user) {
    document.getElementById('null-login').classList.add("login-button-dis");
    document.getElementById('null-login').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';

    document.getElementById('user-pic').src = user.picture;
    document.getElementById('user-name').innerText = `Hello, ${user.name}!`;
    document.getElementById('user-email').innerText = user.email;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    location.reload();
}

// Check if user is already logged in
window.onload = function () {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        updateUI(JSON.parse(savedUser));
    }
};