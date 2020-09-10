"use strict";

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

function displayResults (weather) {
    console.log(weather);
    // 
    let city = document.querySelector('.location .city');
    let now = new Date();
    let date = document.querySelector('.location .date');
    let temp = document.querySelector('.current .temp');
    let weather_el = document.querySelector('.current .weather');
    let hilow = document.querySelector('.hi-low');

    city.innerText = `${weather.name}, ${weather.sys.country}`;
    date.innerText = dateBuilder(now);
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    weather_el.innerText = weather.weather[0].main;
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

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
        addSearchHistory(item.city, item.id, item.temp, item.weather_el);
    });
}

// addSearchHistory function
function addSearchHistory(city, id, temp, weather_el){
    let searchHistory = document.getElementById("searchHistory");

    const item = `<div class="card col-sm-4">
                    <div class="city" id="${id}">${city}</div>
                    <div class="current">
                        <div class="temp">${temp}<span>°C</span></div>
                        <div class="weather">${weather_el}</div>
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
        
        addSearchHistory(city, id, temp, weather_el);

        LIST.push({
            city : city,
            id : id,
            temp : temp,
            weather_el : weather_el
        })

        // add item to locastorage (must be added everywhere list is updated)
        localStorage.setItem("weather-data", JSON.stringify(LIST));
        id++;
    }
}
