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
const popInner = document.querySelector(".login-popup p a");
const cont = document.getElementsByClassName("cont")[0];

login.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display = "block";
    document.querySelector(".blur-overlay").style.display = "block";
    document.querySelector(".login-popup .card-title").innerText = 'Welcome Back';
    document.querySelector(".login-popup p").innerHTML = ` Don't have an account? <a class="signup"> Sign Up </a> `
});
signup.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display ="block";
    document.querySelector(".blur-overlay").style.display= "block";
    document.querySelector(".login-popup .card-title").innerText = 'Create Account';
    document.querySelector(".login-popup p").innerHTML = ` Already have an account? <a class="login"> Log In </a>  `
});

cont.addEventListener("click", function() {
    document.querySelector(".login-popup").style.display = "none";
    document.querySelector(".blur-overlay").style.display = "none";
});
popInner.addEventListener("click", function (event) {
    const x = event.target.classList[0];
    console.log(x);
})