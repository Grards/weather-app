import { geocodingKeyAPI, unsplashKeyAPI } from "./access.js"
import { weatherGraph } from "./chart.js"
import { chartStorage } from "./local-storage.js"

const limit = 5 // This is the max value for returns in the API
const states = document.getElementById("weather-states")

export async function geocodingConnexion(cityName){
    
    const response = await fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${cityName ? cityName : cityName = " "}&limit=${limit}&appid=${geocodingKeyAPI}`)
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

    datasContainer.innerHTML += `
        <h3>${cityName}</h3>
        <p>${weatherDatas.city.name}</p>
        <h4>${country} ${state === "undefined" ? "" : "- " + state}</h4>
        <img src="${cityPicture}" class="city-img" alt="Unsplash image of ${weatherDatas.city.name}">
    `
    
    const groupedDatas = groupPerDate(weatherDatas.list);
    const actualDate = new Date()
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    let id = Date.now()
    let graphArray = []
    let actualDay = actualDate.getDay()

    for(const date in groupedDatas){
        datasContainer.innerHTML += `
            <section class="weather-section" data-actualday="${weekday[actualDay]}">
                <div class="weather__day">
                    <h3>${weekday[actualDay]}</h3>
                    <h4>${date}</h4>
                </div>
                <div id="${id}" class="weather__content">
                    <canvas class="weather-charts new-chart"></canvas>
        `

        let contentOfMoment = document.getElementById(id)
        groupedDatas[date].forEach(data => {
            contentOfMoment.innerHTML += `
                <ul class="weather__informations" data-id="${id}" data-day=${actualDay}>
                    <li><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Icon of the actual weather"></li>
                    <li>Hour : ${(data.dt_txt).substring(11,19)}</li>
                    <li>Conditions : ${data.weather[0].description}</li>
                    <li>Temperature : ${data.main.temp} °C</li>
                    <li>Feels Like : ${data.main.feels_like} °C</li>
                    <li>Humidity : ${data.main.humidity}%</li>
                    <li>Temp. Max : ${data.main.temp_max} °C</li>
                    <li>Temp. Min : ${data.main.temp_min} °C</li>
                </ul>
            `
            let objectForGraph = {
                id: id,
                day : weekday[actualDay],
                hour: (data.dt_txt).substring(11,19),
                tempMin : data.main.temp_min,
                tempMax : data.main.temp_max
            }
            graphArray.push(objectForGraph)
            
        })
        datasContainer.innerHTML += `
                </div>
            </section>
        `
        ++id
        actualDay > 5 ? actualDay = 0 : ++actualDay 
    }// weatherGraph(graphArray)
    chartStorage(graphArray)
    

    const weatherDays = document.getElementsByClassName("weather__day")
    for(let day of weatherDays){
        day.addEventListener("click", event => {
            const contentToToggle = event.target.parentElement.nextElementSibling
            contentToToggle.classList.toggle("toggleVisibility")
        })
    }
}

function groupPerDate(datasList) {
    const datasPerDate = {};

    datasList.forEach(data => {
        const date = data.dt_txt.substring(0, 10);

        if (datasPerDate[date]) {
            datasPerDate[date].push(data);
        } else {
            datasPerDate[date] = [data];
        }
    });
    return datasPerDate;
}




