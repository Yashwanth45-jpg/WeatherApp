const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")
//error handling
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
//initially declaring variables
let currentTab = userTab;
const API_key = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(tab) {
    if(tab!=currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = tab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("acive");
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click", function(){
    //pass clicked tab as input parameter   
    switchTab(userTab);
});

searchTab.addEventListener("click", function(){
    switchTab(searchTab);
})

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    //make loader visible

    loadingScreen.classList.add("active");
    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await result.json();

        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }   
    catch(error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo) {

    //firstly , we have to fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather[0].icon}.png`;
    temp.innerText = `${weatherInfo.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo.clouds?.all}%`;
}
function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert('Soory Oooops you are in Hell!!!!');
    }
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);


let searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(searchInput.value === "")
         return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`)
        const data = await res.json();
        if (!data.sys) {
            throw data;
          }
        console.log(data)
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error) {
        apiErrorContainer.classList.add("active");
        loadingScreen.classList.remove("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}


























// const API_key = "d1845658f92b31c64bd94f06f7188c9c";
// //ek acche function ki khas bhat hoti hai jo eki kam kartha ho
// //means ek function data latha hai aur ek function us data ko ui par dikhata hai

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} degree Celcius`;
//     //yaha par error karoge
//     document.body.appendChild(newPara);
// }



// async function fetchWeatherDetails() {
    
//     let city = 'goa'
//     try{
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
//         var data = await response.json();
//         console.log("weather data->", data);
//     }
//     catch(error) {
//         console.log('error')
//     }
//     renderWeatherInfo(data);
// }

// async function getCustomWeatherDetails() {
//     let lat = 107.6333;
//     let lon = 16.320001216546841;
//     try{
//         let result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
//         let data = await result.json();
//         console.log(data);
//     }
//     catch(error) {
//         console.log('error in getWeatherDetailsFunction ');
//     }
// }