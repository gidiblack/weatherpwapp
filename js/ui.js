document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});





const form = document.querySelector(".top-side form");
const input = document.querySelector(".top-side input");
const msg = document.querySelector(".top-side .msg");
const showResults = document.querySelector(".bottom-side .results");



// my api details from openweathermap
const api = {
    key:"a4ebe081f0c56979bcbbe865881154ee",
baseUrl:"https://api.openweathermap.org/data/2.5/weather?"
}



// stopping the form from submitting by using preventDefault and then grabbing the user input in the search field


form.addEventListener("submit", e => {
  e.preventDefault();
  const inputVal = input.value;


//   this code is to prevent the display of the same results(same city)
const resultItems = showResults.querySelectorAll('.bottom-side .city');
const resultItemsArray = Array.from(resultItems);

if(resultItemsArray.length > 0){
    const filteredArray = resultItemsArray.filter(el => {
        let content = "";
        if(inputVal.includes(',')){
            if(inputVal.split(',')[1].length > 2){
                inputVal = inputVal.split(',')[0];
                content = el
                .querySelector('.cityName span')
                .textContent.toLowerCase();
            }else {
                content = el.querySelector('.cityName').dataset.name.toLowerCase();
            }
        }else {
            content = el.querySelector('.cityName span').textContent.toLowerCase();
        }
        return content == inputVal.toLowerCase();
    });
    if(filteredArray.length > 0){
        msg.textContent = `The weather for ${filteredArray[0].querySelector('.cityName span').textContent} has been brought out already..`
        // 
        form.reset();
        input.focus();
        return;
    }
}

  //using fetchapi method to send a request to the api
//    fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     // do stuff with the data
//   })
//   .catch(() => {
//     msg.textContent = "Please search for a valid city 😩";
//   });
  const url = `${api.baseUrl}q=${inputVal}&appid=${api.key}&units=metric`;
  console.log(url);

//   the icon code holds the weather info of the searched city

  fetch(url)
    .then(response => response.json()) 
    .then(data => {
      const { main, name, sys, weather } = data; //declaring data object
      const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
      }@4x.png`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="cityName" dataName="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="cityTemp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="cityIcon" src=${icon} alt=${weather[0]["main"]}>
          <figcaption>${weather[0]["description"]}<br/><b>Feels like
          ${Math.round(main.feels_like)}°C</b></figcaption>
        </figure>
      `;
      
      li.innerHTML = markup;
      showResults.appendChild(li);
 
    
 

    })
    .catch(() => {
      msg.textContent = "Please enter a valid city";
    });

    let searchHistory = JSON.parse(localStorage.getItem("searchinput")) || [];
    searchHistory.push(inputVal);
  
    
    localStorage.setItem('searchinput', JSON.stringify(searchHistory));
    
    var lastSearch = JSON.parse(localStorage.getItem("searchinput"));
    console.log(lastSearch);
    

    
      msg.textContent = "";
      form.reset();
      input.focus();
 


    });   

 