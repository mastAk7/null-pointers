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