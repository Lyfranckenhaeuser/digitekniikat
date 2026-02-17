// Haetaan JSON tiedosto
fetch("tietue.JSON")

// Muutetaan JSON muotoon
.then(function(response) {
    return response.json();
})

// Käsitellään data
.then(function(data) {

    let tiedot = "<h2>" + data.otsikko + "</h2>";
    tiedot += "<p>" + data.kuvaus + "</p>";
    tiedot += "<hr>";

    tiedot += "<h3>Opintojakso</h3>";
    tiedot += "Nimi: " + data.opintojakso.nimi + "<br>";
    tiedot += "Tunnus: " + data.opintojakso.tunnus + "<br>";
    tiedot += "Opintopisteet: " + data.opintojakso.opintopisteet + "<br>";

    tiedot += "<h3>Sisältö</h3>";

    for (let i = 0; i < data.sisalto.length; i++) {
        tiedot += data.sisalto[i] + "<br>";
    }

    tiedot += "<p><img src='" + data.kuva + "' width='300'></p>";

    document.getElementById("vastaus").innerHTML = tiedot;
})

// Virhe
.catch(function(error) {
    document.getElementById("vastaus").innerHTML =
        "Tietoa ei voitu hakea.";
});
