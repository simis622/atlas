const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));

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
                    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
                        .then(res => res.json())
                        .then(data => {
                            const country = data[0];
                            modalBody.innerHTML = `
                        <h4>${country.translations.ces.common}</h4>
                    `;
                        })
                        .catch(error => {
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