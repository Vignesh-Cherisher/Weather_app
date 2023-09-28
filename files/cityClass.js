import * as topSection from './WeatherAppTask1.js'

class cityFunctions {
  constructor(jsonEntry) {
    this.cityObject = jsonEntry
    this.dateAndTime = jsonEntry.dateAndTime
    this.precipitation = jsonEntry.precipitation
  }
  changeCityImg() {
    topSection.changeCityImg(this.cityObject)
  }

  changeForecastValues() {
    topSection.changeForecastValues(this.cityObject)
  }
}

class cityObject extends cityFunctions {
  constructor(jsonEntry) {
    super(jsonEntry)
    this.url = jsonEntry.url
    this.name = jsonEntry.cityName
    this.nextFiveHrs = jsonEntry.nextFiveHrs
  }

  changeForecastTimeline() {
    topSection.changeForecastTimeline(this.cityObject)
  }
}

export function createCityObject(jsonEntry) {
  const city = new cityObject(jsonEntry)
  city.changeCityImg()
  city.changeForecastValues()
  city.changeForecastTimeline()
}