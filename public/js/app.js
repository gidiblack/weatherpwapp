"use strict";
// register service worker
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log("service worker not registered", err));
}

// save api base and key in object variable
const api = {
    key: "226a534fb8c967b21c2d3c3b5af602d9",
    base: "https://api.openweathermap.org/data/2.5/weather?q="
}

//load default city
function defaultCity () {
    fetch(`${api.base}new%20york&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

// add event listeners on submit button and enter keypress
const searchBox = document.querySelector('.search-box');
const submitSearch = document.querySelector('.btn-submit');
searchBox.addEventListener('keypress', setQuery);
submitSearch.addEventListener('click', function () { 
    getResults(searchBox.value);
});
// check whcih key was pressed before executing getResults function
function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchBox.value);
    }
}
// fetch search results from openWeather api, then convert to json then display
function getResults (query) {
    fetch(`${api.base}${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}
// display search results 
function displayResults (weather) {
    console.log(weather);
    // 
    let city = document.querySelector('.location .city');
    let now = new Date();
    let date = document.querySelector('.location .date');
    let current = document.querySelector('.current');

    city.innerText = `${weather.name}, ${weather.sys.country}`;
    date.innerText = dateBuilder(now);
    current.innerHTML = `
                        <div class="temp">${Math.round(weather.main.temp)}<span>°c</span></div>
                        <figure>
                            <img class="cityIcon" src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png" alt=${weather.weather[0].main}>
                                <figcaption>${weather.weather[0].description}<br/><b>Feels like
                                ${Math.round(weather.main.feels_like)}°C</b></figcaption>
                        </figure>
                        <div class="hi-low">${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c</div>
                        `

    updateLocalStorage(weather);
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

// localstorage
// Variables to store recent search array
let LIST, id;

// get weather-data from localstorage
let data = localStorage.getItem("weather-data");

// check if data is not empty
if(data){
    LIST = JSON.parse(data);
    id = LIST.length; // set id to the last one in list
    loadList(LIST); // load the list to the UI
}else{
    // if data is empty
    LIST = [];
    id = 0;
}

// load items to the UI
function loadList(array){
    array.forEach(function(item){
        addSearchHistory(item.city, item.id, item.temp, item.weather_el, item.weather_icon);
    });
}

// addSearchHistory function
function addSearchHistory(city, id, temp, weather_el, weather_icon){
    let searchHistory = document.getElementById("searchHistory");

    const item = `<div class="card">
                    <div class="city" id="${id}">${city}</div>
                    <div class="current">
                        <div class="temp">${temp}<span>°C</span></div>
                        <img class="cityIcon" src=${weather_icon} alt=${weather_el}>
                    </div>
                </div>`;
    
    searchHistory.innerHTML += item;
}

function updateLocalStorage (weather) {
    //if the input isn't empty
    if(weather){
        let city = weather.name + ", " + weather.sys.country;
        let temp = Math.round(weather.main.temp);
        let weather_el = weather.weather[0].main;
        let icon = weather.weather[0].icon;
        let weather_icon = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        
        addSearchHistory(city, id, temp, weather_el, weather_icon);

        LIST.push({
            city : city,
            id : id,
            temp : temp,
            weather_el : weather_el,
            weather_icon : weather_icon
        })

        // add item to locastorage (must be added everywhere list is updated)
        localStorage.setItem("weather-data", JSON.stringify(LIST));
        id++;
    }
}
