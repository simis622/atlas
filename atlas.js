const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));
// Přidáme proměnnou pro titulek modalu, abychom jméno státu vypsali do hlavičky okna
const modalTitle = document.querySelector(".modal-title"); 

function loadCountries(region) {
    countriesList.innerHTML = "";
    fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then(res => res.json())
        .then(data => {
            data.forEach((country) => {
                let blockCountry = `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                    <div class="card h-100 d-flex flex-column">
                        <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}" />
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title"><a href="#">${country.translations.ces.common}</a></h4>
                            <p class="card-text">Hlavní město: <b>${country.capital ? country.capital[0] : "Neznámo"}</b></p>
                            <p class="mt-auto mb-0"><button class="btn btn-info" 
                                data-name="${country.name.common}">Informace</button></p>
                        </div>
                    </div>                                        
                </div>            
            `;
                countriesList.innerHTML += blockCountry;
            });
            
            document.querySelectorAll('button[data-name]').forEach(button => {
                button.addEventListener('click', () => {
                    const countryName = button.getAttribute('data-name');
                    modal.show();
                    
                    // Zobrazení načítacího textu, než dorazí data z API
                    modalBody.innerHTML = "<p>Načítám data...</p>"; 

                    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
                        .then(res => res.json())
                        .then(data => {
                            const country = data[0];
                            
                            // 1. Zpracování měn (převod z objektu na text)
                            let currencies = "Neznámo";
                            if (country.currencies) {
                                currencies = Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ');
                            }

                            // 2. Zpracování jazyků
                            let languages = "Neznámo";
                            if (country.languages) {
                                languages = Object.values(country.languages).join(', ');
                            }

                            // 3. Nastavení titulku modalu
                            if (modalTitle) {
                                modalTitle.textContent = country.translations.ces.common;
                            }

                            // 4. Vypsání detailů do těla modalu pomocí seznamu z Bootstrapu
                            modalBody.innerHTML = `
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>Originální název:</strong> ${country.name.official}</li>
                                    <li class="list-group-item"><strong>Hlavní město:</strong> ${country.capital ? country.capital[0] : "Neznámo"}</li>
                                    <li class="list-group-item"><strong>Počet obyvatel:</strong> ${country.population.toLocaleString('cs-CZ')}</li>
                                    <li class="list-group-item"><strong>Rozloha:</strong> ${country.area.toLocaleString('cs-CZ')} km²</li>
                                    <li class="list-group-item"><strong>Měna:</strong> ${currencies}</li>
                                    <li class="list-group-item"><strong>Jazyky:</strong> ${languages}</li>
                                    <li class="list-group-item"><strong>Oblast:</strong> ${country.subregion ? country.subregion : country.region}</li>
                                </ul>
                            `;
                        })
                        .catch(error => {
                            modalBody.innerHTML = `<p class="text-danger">Nepodařilo se načíst detaily o státu.</p>`;
                            console.log(`Nastala chyba: ${error}`);
                        })
                });
            });
        })
        .catch(error => {
            console.log(error);
        });
}

loadCountries("europe");

continent.addEventListener("change", function (event) {
    loadCountries(event.target.value);
});