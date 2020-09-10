"use strict";
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
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
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

let LIST, id;

let historyData = localStorage.getItem("history");

// check if data is not empty
if(historyData){
    LIST = JSON.parse(historyData);
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
        addHistory(item.name, item.id, item.done, item.trash);
    });
}

// function addToHistory(event) {
//     let recentCity = document.querySelector('.card .city');
//     let recentTemp = document.querySelector('.card .temp');
//     let recentWeather = document.querySelector('.card .weather');

//     if 
// }