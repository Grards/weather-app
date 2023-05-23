export function weatherGraph(infos){
  const ctx = document.getElementsByClassName('weather-charts');
  console.log(infos)

  for(let chart of ctx){
    let hours = []
    let tempMin = []
    let tempMax = []
    let tempAverage =[]

    for(let element of infos){
      if(element.id == chart.parentElement.id){
        hours.push(element.hour)
        tempAverage.push((element.tempMin + element.tempMax)/2)
      }
    }

    new Chart(chart, {
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