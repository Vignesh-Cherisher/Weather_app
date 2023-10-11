import * as http from ('http')

export function requestTimeZone() {
  http.get("/all-timezone-cities", (req, res) => {
    console.log('got request')
    let currentTime = new Date();
    if (currentTime - startTime > dayCheck) {
      startTime = new Date()
      weatherResult = timeZone.allTimeZones()
      res.json(weatherResult);
    } else {
      if (weatherResult.length === 0) {
        weatherResult = timeZone.allTimeZones();
      }
      res.json(weatherResult)
    }
  })
}