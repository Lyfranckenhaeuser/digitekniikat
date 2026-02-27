
window.onload = function () {
    if (document.getElementById("vastaus")) { haeTiedot(); }
    if (document.getElementById("toteutus-vastaus")) { haeToteutus(); }
    if (document.getElementById("saa-vastaus")) { haeSaa(); }

    // Enter-näppäimellä Pokemon-hakuun
    const pokeInput = document.getElementById("pokemonName");
    if (pokeInput) {
        pokeInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                poke();
            }
        });
    }
};

/* TEHTÄVÄ 1: JSON-tiedoston haku ja käsittely */
// Hakee yleiset tiedot tietue.JSON-tiedostosta
function haeTiedot() {
    fetch('tietue.JSON')
        .then(function (res) { return res.json(); })
        .then(function (obj) {
            // Lisätään otsikko, kuvaus ja kuva
            let tiedot = "<h1>" + obj.otsikko + "</h1>";
            tiedot += "<p class='small text-muted text-center'>" + obj.kuvaus + "</p>";
            tiedot += "<img src='" + obj.kuva + "' class='hero-img' style='width:100%; max-width:600px;'>";

            // Luodaan opintojakson tiedot
            tiedot += "<div class='opintojakso-info' style='margin-top:20px;'>";
            tiedot += "<h3>Opintojakso</h3>";
            tiedot += "<b>Nimi:</b> " + obj.opintojakso.nimi + "<br>";
            tiedot += "<b>Tunnus:</b> " + obj.opintojakso.tunnus + "<br>";
            tiedot += "<b>Opintopisteet:</b> " + obj.opintojakso.opintopisteet + " op";
            tiedot += "</div>";

            // Sisällön ja linkkien läpikäynti
            tiedot += "<div class='aiheet-section'><h3>Sisältö</h3>";
            for (var i = 0; i < obj.sisalto.length; i++) {
                let cleanLink = obj.sisalto[i].linkki.trim();
                tiedot += "<p style='margin-bottom:10px;'>";
                tiedot += "<b>Aihe: </b>" + obj.sisalto[i].aihe + "  ";
                tiedot += "<a href='" + cleanLink + "' class='aihe-link' target='_blank'>" + cleanLink + "</a>";
                tiedot += "</p>";
            }
            tiedot += "</div>";

            document.getElementById("vastaus").innerHTML = tiedot;
        })
        .catch(err => {
            console.error("Virhe tietoja haettaessa:", err);
            document.getElementById("vastaus").innerHTML = "Tietoja ei voitu ladata.";
        });
}

// Hakee toteutuksen tiedot ja osallistujen tiedot

function haeToteutus() {
    fetch('tietue.JSON')
        .then(res => res.json())
        .then(obj => {
            const kuvaToteutus = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&auto=format&fit=crop&q=60";
            let tiedot = `
                <h2 class="text-primary text-start">${obj.toteutus.nimi}</h2>
                <div class="text-start mt-3">
                    <p><b>Lukumäärä:</b> ${obj.osallistujat.lukumaara}</p>
                    <p><b>Osallistujat:</b> ${obj.osallistujat.nimet.join(', ')}</p>
                    <p><b>Kesto:</b> ${obj.toteutus.kesto}</p>
                </div>
                <div class="text-center mt-4">
                    <img src="${kuvaToteutus}" class="img-fluid rounded shadow" style="max-width: 100%; height: auto;">
                </div>
            `;
            document.getElementById("toteutus-vastaus").innerHTML = tiedot;
        })
        .catch(err => {
            document.getElementById("toteutus-vastaus").innerHTML = "Tietojen haku epäonnistui.";
        });
}

/* TEHTÄVÄ 2: Pokemon API */
// Hakee Pokemonin tiedot
function poke() {
    const pokeName = document.getElementById("pokemonName").value.toLowerCase();
    let name = document.getElementById("pokemonName").value;

    if (!pokeName) return;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        .then(function (response) {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(function (responseJson) {
            responseJson.customName = name;
            pokekuva(responseJson);
        })
        .catch(function (error) {
            document.getElementById("nimi").innerHTML = "<p class='text-danger'>Tietoa ei pystytä hakemaan</p>";
            // Tyhjennetään näkymä virheen sattuessa
            document.getElementById("vastaus_pokemon").innerHTML = "";
            document.getElementById("nappi_alue").innerHTML = "";
            document.getElementById("kuva2").innerHTML = "";
        });
}

//Pokemonin perustiedot ja käännä-nappi näkyviin
function pokekuva(obj) {
    let pokeurl = obj.sprites.front_default;
    let backUrl = obj.sprites.back_default;
    let name = obj.customName.toUpperCase();
    // Tallennetaan Pokemonin
    document.getElementById("pokemonName").dataset.savedName = name;
    document.getElementById("vastaus_pokemon").innerHTML = "";
    document.getElementById("nappi_alue").innerHTML =
        `<button class="btn btn-poke" onclick="kaanna('${backUrl}', ${obj.height}, ${obj.weight}, ${obj.base_experience})">käännä</button>`;

    document.getElementById("nimi").innerHTML = "<br><b>" + name + "</b>";
    document.getElementById("kuva2").innerHTML = `<br><img src="${pokeurl}" id="pimg" width="150">`;
    document.getElementById("pokemonName").value = "";
}

// Vaihtaa Pokemonin kuvan takakuvaan ja näyttää lisätilastot.
function kaanna(url, height, weight, exp) {
    document.getElementById("pimg").src = url;
    let name = document.getElementById("pokemonName").dataset.savedName;
    document.getElementById("nimi").innerHTML = "";

    let statsHtml = `
        <div class="mt-3 fw-bold">
            <p>Height: ${height}</p>
            <p>Weight: ${weight}</p>
            <p>Base experience: ${exp}</p>
            <br>
            <p style="font-size: 1.5rem; color: #3b4cca;">${name}</p>
        </div>
    `;
    document.getElementById("vastaus_pokemon").innerHTML = statsHtml;
}

/* TEHTÄVÄ 3: Sää-API */

// Hakee Helsingin säätiedot 
function haeSaa() {
    const url = "https://api.openweathermap.org/data/2.5/weather?id=658225&appid=665ecd56dfc08dbb50feb8b8f5034e28&lang=fi&units=metric";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let aika = new Date().toLocaleTimeString('fi-FI', {
                hour: '2-digit',
                minute: '2-digit'
            });

            let iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

            let html = `
                <h1>Sää Helsingissä</h1>
                <div class="aika">Sää kello: ${aika}</div>
                <div style="text-align: left; display: inline-block;">
                    <p><span class="saa-label">Sää:</span> ${data.weather[0].description}</p>
                    <p><span class="saa-label">Lämpötila:</span> ${data.main.temp} °C</p>
                    <p><span class="saa-label">Tuuli:</span> ${data.wind.speed} m/s</p>
                </div>
                <img src="${iconUrl}" alt="sääkuva" style="background: rgba(255,255,255,0.5); border-radius: 50%;">
            `;

            document.getElementById("saa-vastaus").innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("saa-vastaus").innerHTML = "Säätietoja ei pystytä hakemaan";
        });
}