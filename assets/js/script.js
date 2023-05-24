import { refreshDatas } from "./modules/local-storage.js";
import { PotentialCity, WeatherDatas } from "./modules/weather-app.js";

const weatherForm = document.getElementById("weather-form")
const weatherCity  = document.getElementById("weather-city")

weatherCity.addEventListener("keyup", event => {
    PotentialCity(weatherCity.value)
})

weatherForm.addEventListener("click", event => {
    if(event.target.id === "weather-submit"){
        event.preventDefault()
        let radioButtons = weatherForm.getElementsByTagName("input")
        for(let button of radioButtons){
            if(button.name == "state" && button.checked){
                WeatherDatas(button.dataset.country, button.dataset.lat, button.dataset.lon, button.dataset.name, button.dataset.state)
            }
        }
    }
})

refreshDatas()