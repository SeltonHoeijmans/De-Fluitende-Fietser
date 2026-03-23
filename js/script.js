// SLIDER
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
let sliderInterval;

function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove("active"));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetSliderInterval();
}

function resetSliderInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => changeSlide(1), 5000);
}

if (slides.length > 0) {
    resetSliderInterval();
}

// OPEN / GESLOTEN
const statusEl = document.getElementById("winkelStatus");
if (statusEl) {
    const now = new Date();
    const dag = now.getDay();
    const uur = now.getHours();
    const minuten = now.getMinutes();
    const tijd = uur + minuten / 60;

    const maVrijOpen = dag >= 1 && dag <= 5 && tijd >= 9 && tijd < 18;
    const zatOpen = dag === 6 && tijd >= 9 && tijd < 17;

    if (maVrijOpen || zatOpen) {
        statusEl.textContent = "De winkel is nu open";
        statusEl.classList.add("open");
    } else {
        statusEl.textContent = "De winkel is momenteel gesloten";
        statusEl.classList.add("gesloten");
    }
}

// BEWEGENDE FIETSER
const fietser = document.getElementById("fietser");
if (fietser) {
    let pos = 0;
    let richting = 1;
    const baan = fietser.parentElement;

    setInterval(() => {
        const maxPos = baan.offsetWidth - fietser.offsetWidth;
        pos += richting * 2;

        if (pos >= maxPos) {
            richting = -1;
            fietser.style.transform = "scaleX(-1)";
        }
        if (pos <= 0) {
            richting = 1;
            fietser.style.transform = "scaleX(1)";
        }

        fietser.style.left = pos + "px";
    }, 16);
}

// VERHUUR PRIJSCALCULATOR
const options = document.querySelectorAll(".rental-option");
const totalDisplay = document.getElementById("totalPrice");
const reserveBtn = document.getElementById("reserveBtn");

if (options.length > 0) {
    function calculateTotal() {
        let total = 0;
        options.forEach(o => { if (o.checked) total += parseInt(o.value); });
        if (totalDisplay) totalDisplay.textContent = total;
        if (reserveBtn) reserveBtn.disabled = total === 0;
    }
    options.forEach(o => o.addEventListener("change", calculateTotal));
    if (reserveBtn) {
        reserveBtn.addEventListener("click", () => alert("Reservering succesvol verzonden!"));
    }
}

// CONTACTFORMULIER
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const naam = document.getElementById("naam").value.trim();
        const email = document.getElementById("email").value.trim();
        const bericht = document.getElementById("bericht").value.trim();
        if (!naam || !email || !bericht) {
            alert("Vul alle velden in.");
            return;
        }
        alert("Bericht succesvol verzonden!");
        contactForm.reset();
    });
}

// FADE-IN
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = "opacity 0.4s ease";
        document.body.style.opacity = 1;
    }, 50);
});