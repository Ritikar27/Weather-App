const selectCountries = document.getElementById("countries");
const selectCities = document.getElementById("cities1");
const submitBtn = document.getElementById("weather");
const countryDetail = document.getElementById("countryDetails");
const dateInfo = document.getElementById("date");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const temp = document.getElementById("temp");
const text = document.getElementById("text");
const today = document.getElementById("today");
const tomorrow = document.getElementById("tomorrow");
const tomWeather = document.getElementById("tomWeather");
const resultDiv = document.querySelector(".weather-container");

const url = 'https://countriesnow.space/api/v0.1/countries';
let data;

let selectedCityText = "";
let selectedCountryText="";

async function check1() {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        if (!result || !result.data) {
            throw new Error('Invalid data format in response');
        } 
        data = result.data;
        getCountryData(data);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

check1();

async function getCountryData(data){
    try{
        if(!Array.isArray(data)){
            throw new Error("Invalid data Format");
        }
        
        
        data.forEach((country, index)=>{
            let option1 = document.createElement("option");
            option1.text = country.country;
            option1.value = index + 1;
            selectCountries.appendChild(option1);
        })
        
    }
    catch(error){
        console.error("Error occurred: ",error);
    }
}

selectCountries.addEventListener("change",async function (e){
    const selectedCountryIndex = e.target.value - 1;
    const selectedCountry = data[selectedCountryIndex];
    
    try{
        if(!Array.isArray(selectedCountry.cities)){
            throw new Error("Invalid data Format");
        }
        selectCities.innerHTML = "";
        selectedCountry.cities.forEach((city ,index)=>{
            let option2 = document.createElement("option");
            option2.text = city;
            option2.value = index;
            selectCities.appendChild(option2);
        })
        
    }
    catch(error){
        console.error("Error occuried: ",error);
    }
    selectedCountryText = e.target.options[e.target.selectedIndex].text;
})

selectCities.addEventListener("change",(e)=>{
    selectedCityText = e.target.options[e.target.selectedIndex].text;
})
   
let currObserve;
submitBtn.addEventListener("click",()=>{

    const Baseurl = `https://yahoo-weather5.p.rapidapi.com/weather?location=${selectedCityText.toLowerCase()}&format=json&u=f`;
    const options = {
        method: 'GET',
    	headers: {
            'X-RapidAPI-Key': '94b64186cbmsh947cdb3d2bdd28ap17b25cjsn96e8e107c10b',
		'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
    	}
    };
    
    async function check(){
        try {
            const response = await fetch(Baseurl, options);
            const result = await response.json();
            currObserve = result.current_observation;
            tmrObserve = result.forecasts[1];
            getDate(currObserve);
            getAstronomy(currObserve.astronomy);
            getAtmosphere(currObserve.atmosphere
            );
            getCondition(currObserve.condition);
            getTomorrow(tmrObserve);
        } catch (error) {
            console.error(error);
        }
    }
    resultDiv.classList.add("hide");
    if(selectedCountryText ===""){
        alert("Kindly Select Country and City to Get Information");
    }
    check();
})

async function getDate(currObserve) {
    try {
        if (!currObserve) {
            throw new Error("No Data received from API");
        }

        const pubDate = currObserve.pubDate;
        const milliSec = pubDate * 1000;
        const dateObj = new Date(milliSec);
        const dateStr1 = dateObj.toLocaleString();
        const timeStr = dateStr1.split(", ")[1];
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const dateStr = dateObj.toLocaleDateString('en-GB', options);
        dateInfo.innerText = await `Date & Time: ${dateStr}, ${timeStr}`;
        today.innerText = "Today";
        countryDetail.innerText = `Location: ${selectedCityText},${selectedCountryText}`;
        tomorrow.innerText = "Tomorrow";
        resultDiv.classList.remove("hide");

    } catch (error) {
        console.error("Error Occurred", error);
    }
}


async function getAstronomy(astronomy){
    const sunriseTime = astronomy.sunrise;
    const sunsetTime = astronomy.sunset;
    sunrise.innerText = `Sunrise: ${sunriseTime}`;
    sunset.innerText = `Sunset: ${sunsetTime}`;
}

async function getAtmosphere(atmosphere){
    const humidityValue = atmosphere.humidity;
    const visibilityValue = atmosphere.visibility;
    humidity.innerText = `Humidity: ${humidityValue}`;
    visibility.innerText = `Visibility: ${visibilityValue}`;
}
async function getCondition(condition){
    const tempValue = condition.temperature;
    const textValue = condition.text;
    const temperature = (tempValue - 32) * 5/9;
    temp.innerText = `Temperature: ${parseInt(temperature)}C & ${tempValue}F`;
    text.innerText = `Weather: ${textValue}`;
}
async function getTomorrow(tmrObserve){
    const tmrWeather = tmrObserve.text;
    tomWeather.innerText = `Weather: ${tmrWeather}`; 
}
