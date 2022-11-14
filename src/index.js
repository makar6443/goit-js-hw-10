import './css/styles.css';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const MAX_CONTRIES = 10;
const MORE_MAX = 'More MAX';

function clearAll() {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
}

const fetchCountries = name => {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > MAX_CONTRIES) {
                throw new Error(MORE_MAX);
            }
            renderCountiesListItems(data);
        })
        .catch(error => {
            if (error.message === '404') {
                clearAll();
                Notiflix.Notify.failure('Oops, there is no country with that name');
            }
            if (error.message === MORE_MAX) {
                clearAll();
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            }
        });
};

function renderCountiesListItems(countries) {
    let markup = '';
    const isOne = countries.length === 1;

    countryListRef.style.listStyle = 'none';
    countryListRef.style.margin = '0';
    countryListRef.style.padding = '0';

    clearAll();

    const fontSize = isOne ? '48px' : '30px';

    markup = countries
    .map(
        country =>
        `<li style="margin-botton:100px;display:flex;align-items:center">
    		<img style="display:block"
            src="${country.flags.svg}" 
            alt="Flag of ${country.name.official}" width = 70 height = 35 />
    		<h1 style="font-size:${fontSize};margin:0;margin-left:16px;font-weight:700">${country.name.official}</h1>
    	</li>`
    )
    .join('');

    countryListRef.insertAdjacentHTML('beforeend', markup);

    if (isOne) {
        markup = countries
        .map(
            country =>
                `<p style="fontSize:16px"><b style="fontSize: 16px; fontWeight: 500">Capital: </b>${
                    country.capital
                }</p>
                <p style="fontSize:16px"><b style="fontSize: 16px; fontWeight: 500">Population: </b>${
                    country.population
                }</p>
                <p style="fontSize:16px"><b style="fontSize: 16px; fontWeight: 500">Languages: </b>${Object.values(
                    country.languages
                )
                    .join(', ')}</p>`
        )
        .join('');
        countryInfoRef.insertAdjacentHTML('beforeend', markup);
    }
}

function normalizeName(name) {
    return name.trim().toLowerCase();
}

inputRef.addEventListener(
    'input',
    debounce(() => {
        let name = inputRef.value;
        name = normalizeName(name);
        inputRef.value = name;

        if (name === '') return clearAll();

        fetchCountries(name);
    }, DEBOUNCE_DELAY)
);