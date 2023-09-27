import * as topSection from './WeatherAppTask1.js'

function cityObjectConstructor(jsonEntry) {
  this.cityObject = jsonEntry
  this.name = jsonEntry.cityName
  this.url = jsonEntry.url
  this.dateAndTime = jsonEntry.dateAndTime
  this.precipitation = jsonEntry.precipitation
  this.nextFiveHrs = jsonEntry.nextFiveHrs
}

cityObjectConstructor.prototype.changeCityImg = function () {
  topSection.changeCityImg(this.cityObject)
} 

cityObjectConstructor.prototype.changeForecastValues = function () {
  topSection.changeForecastValues(this.cityObject)
}

cityObjectConstructor.prototype.changeForecastTimeline = function () {
  topSection.changeForecastTimeline(this.cityObject)
}

export function createCityObject(jsonEntry) {
  const city = new cityObjectConstructor(jsonEntry)
  city.changeCityImg()
  city.changeForecastValues()
  city.changeForecastTimeline()
}