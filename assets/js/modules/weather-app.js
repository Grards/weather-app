import { geocodingKeyAPI, unsplashKeyAPI } from "./access.js"

const limit = 5 // This is the max value for returns in the API
const states = document.getElementById("weather-states")


export async function geocodingConnexion(cityName){
    const response = await fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${geocodingKeyAPI}`)
    const city = await response.json()
    geocodingPotentialStates(city)
}

function geocodingPotentialStates(cities){
    if(cities.length > 0){
        states.innerHTML = "<legend>Select a state for your research:</legend>"
        let idTemp = 0
        cities.forEach(city => {
            let newName = city.name.replace(" ", "_")
            ++idTemp
            states.innerHTML+=`
                <div>
                    <input type="radio" id="${newName}_${city.country}_${idTemp}" name="state" value="${city.name}" data-country="${city.country}" data-lat="${city.lat}" data-lon="${city.lon}" data-name="${city.name}" data-state="${city.state}">
                    <label for="${newName}_${city.country}_${idTemp}">${city.country} - ${city.name} ${city.state != undefined ? '(' + city.state + ')' : ''} / Latitude : ${city.lat}, Longitude : ${city.lon}</label>
                </div>
            `
        });
        states.innerHTML+=`
            <input type="submit" id="weather-submit" value="Get the actual weather">
        `
    }else{
        states.innerHTML = ""
    }
}

export async function geocodingWeatherDatas(country, lat, lon, cityName, state){
    const datasContainer = document.getElementById("datas-container")
    
    const response2 = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${geocodingKeyAPI}&units=metric`)
    const weatherDatas = await response2.json()

    const unsplash = await fetch (`https://api.unsplash.com/search/photos?query=${cityName}%20${country}&client_id=${unsplashKeyAPI}`)
    const cityPictures = await unsplash.json()
    const cityPicture = cityPictures.results[0].urls.small
    
    console.log(weatherDatas)

    datasContainer.innerHTML += `
        <h3>${cityName}</h3>
        <p>${weatherDatas.city.name}</p>
        <h4>${country} ${state === "undefined" ? "" : "- " + state}</h4>
        <img src="${cityPicture}" alt="Unsplash image of ${weatherDatas.city.name}">
    `
    for(let data of weatherDatas.list){
        let date = new Date(data.dt)
        datasContainer.innerHTML += `
            <ul class="temperature">
                <li>Date : ${data.dt_txt}</li>
                <li>${date}</li>
                <li><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Icon of the actual weather"></li> 
                <li>Conditions : ${data.weather[0].description}</li>
                <li>Temperature : ${data.main.temp} °C</li>
                <li>Feels Like : ${data.main.feels_like} °C</li>
                <li>Humidity : ${data.main.humidity}%</li>
                <li>Temp. Max : ${data.main.temp_max} °C</li>
                <li>Temp. Min : ${data.main.temp_min} °C</li>
            </ul>
        `
    }

}