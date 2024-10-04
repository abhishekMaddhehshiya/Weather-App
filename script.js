/*
const APIKEY = "251b12dfd534dee199a35c2247785b8c";

async function fetchApi() {
    try {
        let city = "goa";
        const obj = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=matric`);
        const data = await obj.json();
        console.log((data.main.temp - 273).toFixed(2));
    } catch (err) {
        console.log("Error: ", err);
    }
}
async function fetchApi(lat,lon) {
    try {
        const obj = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=matric`);
        const data = await obj.json();
        console.log((data.main.temp - 273).toFixed(2));
    } catch (err) {
        console.log("Error: ", err);
    }
}


var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {

  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  fetchApi(position.coords.latitude,position.coords.longitude);
}

*/

const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")

const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-Container");

//initially variables need

let oldTab = userTab;
const APIKEY = "251b12dfd534dee199a35c2247785b8c";
oldTab.classList.add("current-tab")

getfromSessionStorage();

function switchTab(newTab){
  if(newTab != oldTab){
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
      errorContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.reset();
      searchForm.classList.add("active");
    }
    else{
      searchForm.classList.remove("active");
      errorContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();

    }
  }
}


userTab.addEventListener("click", ()=>{
  switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
  switchTab(searchTab);
})


function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates){
  const {lat,lon} = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");


  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorContainer.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo){
  const cityName = document.querySelector("[data-cityName]");
  const contryIcon = document.querySelector("[data-contryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");


  cityName.innerText = weatherInfo?.name;
  contryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = (weatherInfo?.main?.temp).toFixed(2) + " °C";
  windSpeed.innerText = weatherInfo?.wind?.speed + "m/s";
  humidity.innerText = weatherInfo?.main?.humidity + "%";
  cloudiness.innerText = weatherInfo?.clouds?.all + "%";

  
}


function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {

  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName === ""){
    return;
  }
  else{
    fetchSearchWeatherInfo(cityName);
  }

})

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  errorContainer.classList.remove("active")
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorContainer.classList.add("active");
    console.log("here i am")
   }
}

