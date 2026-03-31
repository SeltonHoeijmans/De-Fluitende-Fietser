var currentSlide = 0;
var slides = document.querySelectorAll(".slide");
var sliderInterval;

function showSlide(index) {
    if (slides.length === 0) return;
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    clearInterval(sliderInterval);
    sliderInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

if (slides.length > 0) {
    sliderInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

var statusEl = document.getElementById("winkelStatus");
if (statusEl) {
    var now = new Date();
    var dag = now.getDay();
    var uur = now.getHours();
    var minuten = now.getMinutes();
    var tijd = uur + minuten / 60;

    var isOpen = false;
    if (dag >= 1 && dag <= 5 && tijd >= 9 && tijd < 18) {
        isOpen = true;
    }
    if (dag === 6 && tijd >= 9 && tijd < 17) {
        isOpen = true;
    }

    if (isOpen) {
        statusEl.textContent = "De winkel is nu open";
        statusEl.classList.add("open");
    } else {
        statusEl.textContent = "De winkel is momenteel gesloten";
        statusEl.classList.add("gesloten");
    }
}

var fietser = document.getElementById("fietser");
if (fietser) {
    var pos = 0;
    var richting = 1;
    var baan = fietser.parentElement;

    setInterval(function() {
        var maxPos = baan.offsetWidth - fietser.offsetWidth;
        pos = pos + richting * 2;

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

var options = document.querySelectorAll(".rental-option");
var totalDisplay = document.getElementById("totalPrice");
var reserveBtn = document.getElementById("reserveBtn");

if (options.length > 0) {
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener("change", calculateTotal);
    }
    if (reserveBtn) {
        reserveBtn.addEventListener("click", function() {
            alert("Reservering succesvol verzonden!");
        });
    }
}

function calculateTotal() {
    var total = 0;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            total = total + parseInt(options[i].value);
        }
    }
    if (totalDisplay) totalDisplay.textContent = total;
    if (reserveBtn) reserveBtn.disabled = total === 0;
}

var contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var naam = document.getElementById("naam").value.trim();
        var email = document.getElementById("email").value.trim();
        var bericht = document.getElementById("bericht").value.trim();

        if (!naam || !email || !bericht) {
            alert("Vul alle velden in.");
            return;
        }
        alert("Bericht succesvol verzonden!");
        contactForm.reset();
    });
}

var fietsModal = document.getElementById("fietsModal");

if (fietsModal) {
    var winkelmandje = [];
    var huidigeFiets = null;

    fietsModal.addEventListener("show.bs.modal", function(e) {
        var knop = e.relatedTarget;

        huidigeFiets = {
            naam: knop.dataset.naam,
            code: knop.dataset.code,
            merk: knop.dataset.merk,
            aandrijving: knop.dataset.aandrijving,
            type: knop.dataset.type,
            geslacht: knop.dataset.geslacht,
            nieuw: knop.dataset.nieuw,
            kleur: knop.dataset.kleur,
            prijs: parseFloat(knop.dataset.prijs),
            prijsLabel: knop.dataset.prijsLabel,
            opmerking: knop.dataset.opmerking,
            afbeelding: knop.dataset.afbeelding
        };

        document.getElementById("modalNaam").textContent = huidigeFiets.naam;
        document.getElementById("modalAfbeelding").src = huidigeFiets.afbeelding;
        document.getElementById("modalCode").textContent = huidigeFiets.code;
        document.getElementById("modalMerk").textContent = huidigeFiets.merk;
        document.getElementById("modalAandrijving").textContent = huidigeFiets.aandrijving;
        document.getElementById("modalType").textContent = huidigeFiets.type;
        document.getElementById("modalGeslacht").textContent = huidigeFiets.geslacht;
        document.getElementById("modalNieuw").textContent = huidigeFiets.nieuw;
        document.getElementById("modalKleur").textContent = huidigeFiets.kleur;
        document.getElementById("modalPrijs").textContent = huidigeFiets.prijsLabel;
        document.getElementById("modalOpmerking").textContent = huidigeFiets.opmerking;
    });

    document.getElementById("voegToeBtn").addEventListener("click", function() {
        if (!huidigeFiets) return;

        var kopie = {
            naam: huidigeFiets.naam,
            code: huidigeFiets.code,
            merk: huidigeFiets.merk,
            aandrijving: huidigeFiets.aandrijving,
            type: huidigeFiets.type,
            geslacht: huidigeFiets.geslacht,
            nieuw: huidigeFiets.nieuw,
            kleur: huidigeFiets.kleur,
            prijs: huidigeFiets.prijs,
            prijsLabel: huidigeFiets.prijsLabel,
            opmerking: huidigeFiets.opmerking,
                afbeelding: huidigeFiets.afbeelding
        };

        winkelmandje.push(kopie);
        updateMandje();
        bootstrap.Modal.getInstance(fietsModal).hide();
        document.getElementById("winkelmandjeBalk").classList.remove("winkelmandje-balk-verborgen");
    });

    function updateMandje() {
        document.getElementById("mandjeAantal").textContent = winkelmandje.length;

        var tbody = document.getElementById("mandjeInhoud");
        tbody.innerHTML = "";
        var totaal = 0;

        for (var i = 0; i < winkelmandje.length; i++) {
            var fiets = winkelmandje[i];
            totaal = totaal + fiets.prijs;

            var rij = document.createElement("tr");
            rij.innerHTML = "<td>" + fiets.naam + "</td><td>" + fiets.prijsLabel + "</td><td><button class='btn btn-sm btn-outline-danger' onclick='verwijderUitMandje(" + i + ")'>✕</button></td>";
            tbody.appendChild(rij);
        }

        document.getElementById("mandjeTotaal").textContent = "€ " + totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2 });

        if (winkelmandje.length === 0) {
            document.getElementById("winkelmandjeBalk").classList.add("winkelmandje-balk-verborgen");
        }
    }

    window.verwijderUitMandje = function(index) {
        winkelmandje.splice(index, 1);
        updateMandje();
    };
}

var zoekInput = document.querySelector(".header-search input");
var fietsKaarten = document.querySelectorAll(".col-lg-4");

if (zoekInput && fietsKaarten.length > 0) {
    zoekInput.addEventListener("input", function() {
        var zoekterm = this.value.toLowerCase().trim();

        for (var i = 0; i < fietsKaarten.length; i++) {
            var kaart = fietsKaarten[i];
            var naam = kaart.querySelector(".card-title").textContent.toLowerCase();
            var omschrijving = kaart.querySelector(".card-text").textContent.toLowerCase();

            if (naam.includes(zoekterm) || omschrijving.includes(zoekterm)) {
                kaart.style.display = "";
            } else {
                kaart.style.display = "none";
            }
        }
    });
}

window.onload = function() {
    document.body.style.opacity = 0;
    setTimeout(function() {
        document.body.style.transition = "opacity 0.4s ease";
        document.body.style.opacity = 1;
    }, 50);
};