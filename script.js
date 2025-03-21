document.addEventListener("DOMContentLoaded", function () {

    // Carousel functionality
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? "block" : "none";
        });
    }

    function changeSlide(direction) {
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    document.querySelector(".prev").addEventListener("click", function () {
        changeSlide(-1);
    });

    document.querySelector(".next").addEventListener("click", function () {
        changeSlide(1);
    });

    showSlide(currentIndex); // Show first slide on page load
});


const login = document.getElementsByClassName("l1")[0];
const signup = document.getElementsByClassName("s1")[0];
const cont = document.getElementsByClassName("cont")[0];

function attachLinkListener() {
    const popInner = document.querySelector(".login-popup p a");
    popInner.addEventListener("click", function (event) {
        event.preventDefault(); // Prevents default link behavior if needed
        var targetClass = event.target.classList[0]; // Get class name

        if (targetClass === "signup") {
            signup.click(); // Trigger signup button click
        } else if (targetClass === "login") {
            login.click(); // Trigger login button click
        }
    });
}


login.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Welcome Back";
    document.querySelector(".login-popup p").innerHTML = `Don't have an account? <a class="signup">Sign Up</a>`;
    attachLinkListener(); // Attach listener after HTML change
});

signup.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = "Create Account";
    document.querySelector(".login-popup p").innerHTML = `Already have an account? <a class="login">Log In</a>`;
    attachLinkListener(); // Attach listener after HTML change
});

cont.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display = "none";
    document.querySelector(".blur-overlay").style.display = "none";
});



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


function handleCredentialResponse(response) {
    // Decode JWT token to get user details
    const user = parseJwt(response.credential);

    // Store user info in localStorage to persist login
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to home page after login
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";  // Redirect AFTER storing user data
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

// Keep user logged in after page refresh
window.onload = function () {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        updateUI(JSON.parse(savedUser));
    }
};

function updateUI(user) {
    document.getElementById('null-login').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';

    document.getElementById('user-pic').src = user.picture;
    document.getElementById('user-name').innerText = `Hello, ${user.name}!`;
    document.getElementById('user-email').innerText = user.email;
}