const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector('[data-searchform]');
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");

let currentTab = userTab;
const Api_key = `47d49b487d4044278f363137242407`;
currentTab.classList.add("current-tab");
getFromSessionStorage();
errorContainer.classList.remove("active");

function switchTab(clickedTab){

        errorContainer.classList.remove("active");
        if(clickedTab!=currentTab){  //this is for css like tab color changer
            currentTab.classList.remove("current-tab");
            currentTab = clickedTab;
            currentTab.classList.add("current-tab");
        }
        if(!searchForm.classList.contains("active")){// if i want to move from yourWeather to searchtab

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // if i want to move from searchTab to yourWeathr Tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now you are in yourWeather tab and show the userLocation weather info
            getFromSessionStorage();
        }

}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})



// check if coordinate stored in local session

function getFromSessionStorage()
{
    const localcoordinates = sessionStorage.getItem("user_coordinates");
    if(!localcoordinates){
        grantAccessContainer.classList.add("active");

    }
    else{
        // if coordinates are stored
        const coordinates = JSON.parse(localcoordinates);
        fetchuserWeatherInfo(coordinates);
    }
}


async function fetchuserWeatherInfo(coordinates){
    // console.log(coordinates);
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
            console.log(lat,lon);
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${Api_key}&q=${lat},${lon}`);
            const data  = await response.json();
            loadingScreen.classList.remove("active");
            errorContainer.classList.remove("active");

            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
    }
 
    catch(err){
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        console.log("error found in fetchuserWeatherInfo found !!",err);

    }
}






function renderWeatherInfo(data){

        const cityname = document.querySelector("[data-cityName]");
        const countryName = document.querySelector("[data-countryName]");
        const description = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temprature = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windSpeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloud =    document.querySelector("[data-cloud]");
          

        if(data?.location?.name==undefined){
            userInfoContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
            
        }
        cityname.innerHTML = data?.location?.name;
        countryName.innerHTML = data?.location?.country;
        
        
        description.innerText = data?.current?.condition?.text;
        weatherIcon.src = data?.current?.condition?.icon;
        temprature.innerText = `${data?.current?.temp_c} °C`;
        windspeed.innerText = data?.current?.wind_mph;
        humidity.innerText = data?.current?.humidity;
        cloud.innerText = data?.current?.cloud;


}

function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        console.log("this browser don't support geoloaction services!");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon: position.coords.longitude
    };
    
    sessionStorage.setItem("user_coordinates",JSON.stringify(userCoordinates));// user_coordinates this is a parameter
    fetchuserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click',getLocation);

const searchInput = document.querySelector("[data-searchinput]");

const searchButton = document.querySelector("[search-btn]");

searchForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        console.log(searchInput.value);
        console.log("searchbtn clicked");
        let SeacrhPlaceName = searchInput.value;
        console.log(searchInput.value);
        if (SeacrhPlaceName===""){
            return;
        }
      
        else{
            fetchSearchWeatherInfo(SeacrhPlaceName);
        }
    })
async function fetchSearchWeatherInfo(name)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${Api_key}&q=${name}`)
        const searchData = await response.json();
        loadingScreen.classList.remove("active");
        errorContainer.classList.remove("active");

        userInfoContainer.classList.add("active");
        renderWeatherInfo(searchData);

    }
    catch(e)
    {
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        console.log("found error in fetchSearchWeatherInfo function",e);
    }

}


































