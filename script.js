let yourWeather = document.querySelector("[data-your-weather]");
let searchWeather = document.querySelector("[data-search-weather]");
let searchBar = document.querySelector("[data-search-bar]");
let searchBarCity = document.querySelector("[data-search-bar-city]");
let locationAccess = document.querySelector("[data-locationAccess]");
let loader = document.querySelector("[data-loader]");
let error404 = document.querySelector("[data-404]");

const apiKey = "b668832ea1412d78f2e89d71170de9a0";
let currentTab=yourWeather;
checkLocationCords();

// Switch Tab
function switchTab(clickedTab) {
    if (currentTab != clickedTab) {
        currentTab.classList.remove("text-black","bg-white")
        currentTab=clickedTab;
        currentTab.classList.add("text-black","bg-white")
        
        if (searchBar.classList.contains("hidden")) {
            displayWeatherData.classList.add("hidden");
            searchBar.classList.remove("hidden");
            locationAccess.classList.add("hidden");
            error404.classList.add("hidden");
        }else{
            displayWeatherData.classList.add("hidden");
            searchBar.classList.add("hidden");
            error404.classList.add("hidden");
            checkLocationCords();
        }
    }    
}

// Tab switch Buttons
yourWeather.addEventListener('click',()=>{switchTab(yourWeather)});
searchWeather.addEventListener('click',()=>{switchTab(searchWeather)});

// Event Listner on Search button
searchBarCity.addEventListener("submit",(e)=>{
    e.preventDefault();
    displayWeatherData.classList.add("hidden");
    error404.classList.add("hidden");
    let city = searchForm.elements['Search'].value;
    let api_link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    getWeatherData(api_link);
})

// fatch Data Async Function
async function getWeatherData(link){
    loader.classList.remove("hidden");
    try {
        const response =await fetch(`${link}`);
        if (!response.ok) {
            error404.classList.remove("hidden");
        }else{
            let data = await response.json();
            render(data);
        }
        loader.classList.add("hidden");
    } catch (e) {
        console.log(e);
        loader.classList.add("hidden");
    }
}

// Render Function to display data
let displayWeatherData = document.querySelector("[data-current-weather-info]");
function render(data){
    displayWeatherData.classList.remove("hidden");
    
    let cityName = document.querySelector("[data-city]");
    let country = document.querySelector("[data-country]");
    let condition = document.querySelector("[data-condition]");
    let conditionImg = document.querySelector("[data-condition-img]");
    let temp = document.querySelector("[data-temp]");
    let windspeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let clouds = document.querySelector("[data-clouds]");
    
    cityName.textContent = data?.name;
    country.setAttribute("src",`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`);
    
    condition.textContent = data?.weather?.[0].description;
    conditionImg.setAttribute("src",`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}.png`);
    
    temp.textContent= (data?.main?.temp-273.15).toFixed(2)+"°C";
    windspeed.textContent= data?.wind?.speed+"m/s";
    humidity.textContent = data?.main?.humidity+"%";
    clouds.textContent = data?.clouds?.all+"%";
    
}

// Chacking location Cordinates are Present or not
function checkLocationCords() {
    if (sessionStorage.getItem("user-cordinates")) {
        let val=JSON.parse(sessionStorage.getItem("user-cordinates"));
        let api_link = `https://api.openweathermap.org/data/2.5/weather?lat=${val.lat}&lon=${val.lon}&appid=${apiKey}`
        getWeatherData(api_link);
    }else{
        locationAccess.classList.remove("hidden");
    }
}

// grant Location Access Button
let grantAccess = document.querySelector("[data-grant-access]");
grantAccess.addEventListener('click',()=>{
    getLocationCords();
});

// Get Location Cordinates
function getLocationCords() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cordinates);
    }else{
        console.log("don't have permission to access Your Location")
    }
}

// Set Location Cordinates and fatch api
function cordinates(position) {
    locationAccess.classList.add("hidden");
    let cord = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinates",JSON.stringify(cord));
    let api_link_position = `https://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.lon}&appid=${apiKey}`
    getWeatherData(api_link_position);
}