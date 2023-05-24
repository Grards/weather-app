import { openWeatherKeyAPI, unsplashKeyAPI } from "./access.js"
import { storeGraphs } from "./local-storage.js"

const limit = 5 // 5 is the max value of returns authorized by the API, per request.
const states = document.getElementById("weather-states")

/**
 * Get the names of the cities that match the word encoded in the dedicated text input.
 * @param {string} cityName 
 */
export async function PotentialCity(cityName){
    const response = await fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName ? cityName : cityName = " "}&limit=${limit}&appid=${openWeatherKeyAPI}`)
    const city = await response.json()
    PotentialStates(city)
}

/**
 * Show the cities who match with the research. 
 * Each city have his own state.
 * The user must now select a radio button and confirm his research who contain the name of the city and his state.
 * @param {string} cities 
 */
function PotentialStates(cities){
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

/**
 * Return the datas from the request to OpenWeatherApp API. 
 * The request uses "latitudes" and "longitudes".
 * 
 * The other request return an image of the city from the Unsplash API.
 * The request uses the name of the city and his country to find an adequate response.
 * @param {string} country 
 * @param {double} lat 
 * @param {double} lon 
 * @param {string} cityName 
 * @param {string} state 
 */
export async function WeatherDatas(country, lat, lon, cityName, state){
    const datasContainer = document.getElementById("datas-container")
    
    const response2 = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherKeyAPI}&units=metric`)
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
    
    const groupedDatas = groupPerDate(weatherDatas.list); // .list returns a list of objects with multiple datas, since the OpenWeatherMap API.
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
    storeGraphs(graphArray)
    

    const weatherDays = document.getElementsByClassName("weather__day")
    for(let day of weatherDays){
        day.addEventListener("click", event => {
            const contentToToggle = event.target.parentElement.nextElementSibling
            contentToToggle.classList.toggle("toggleVisibility")
        })
    }
}


/**
 * Uses a list of objects of datas and group them by date.
 * Each date will be an array.
 * And this array will contain the correspondants weather datas.
 * @param {list} datasList 
 * @returns 
 */
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




