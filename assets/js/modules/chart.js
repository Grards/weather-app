let graph = ""

/**
 * Show all graph with the graph.js API
 * @param {array} chartStorage 
 */
export function weatherGraph(chartStorage){
  const ctx = document.getElementsByClassName('weather-charts')
  console.log(chartStorage)

  for(let chart of ctx){
    let hours = []
    let tempAverage =[]
    
    chartStorage.forEach(element => {
      if(element.id == chart.parentElement.id){
        hours.push(element.hour)
        tempAverage.push((element.tempMin + element.tempMax)/2)
      }
    });

    graph = new Chart(chart, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Average Temperatures of the day',
            data: tempAverage,
            borderWidth: 2
          }
        ]
      },
      options: {
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
