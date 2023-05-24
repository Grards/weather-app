import { weatherGraph } from "./chart.js"

let chartStore

export function chartStorage(graphArray){
    let tempStorage = getLocalStorage()
    for(let data of graphArray){
        tempStorage.push(data)
    }
    localStorage.setItem("chartStorage", JSON.stringify(tempStorage))
    refreshDatas()
}

export function getLocalStorage(){
    chartStore = JSON.parse(window.localStorage.getItem("chartStorage")) || []
    return chartStore
}


function refreshDatas(){
    weatherGraph(getLocalStorage())
}