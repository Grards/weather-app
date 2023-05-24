import { weatherGraph } from "./chart.js"

let chartStore

/**
 * Store all the graph datas from each city. 
 * @param {array} graphArray 
 */
export function storeGraphs(graphArray){
    let tempStorage = getTemperatureGraphs()
    for(let data of graphArray){
        tempStorage.push(data)
    }
    localStorage.setItem("chartStorage", JSON.stringify(tempStorage))
    refreshDatas()
}

/**
 * Get the temperatures datas from the LocalStorage of the browser.
 * @returns an array of JSON objects for the temperature graphics.
 */
export function getTemperatureGraphs(){
    chartStore = JSON.parse(window.localStorage.getItem("chartStorage")) || []
    return chartStore
}

/**
 * Refresh all datas of the page for each action / visit.
 */
export function refreshDatas(){
    weatherGraph(getTemperatureGraphs())
}