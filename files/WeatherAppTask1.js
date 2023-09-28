import * as middleSection from './WeatherAppTask2.js'
import * as bottomSection from './WeatherAppTask3.js'
import * as cityProtoFunctions from './cityClass.js'
import * as unitFunctions from './utils.js'

const cityImage = document.querySelector('#city-image').children[0]
const cityValue = document.querySelector('#cities')
const cityInput = document.getElementsByClassName('drop-down')[0]
const cityDate = document.querySelector('#date')
const cityAmPm = document.querySelector('#am-pm')
const forecastedValues = document.querySelectorAll('.forecast-values')
const forecastedTemperature = document.querySelectorAll('.forecast-temperature')
const scaleTime = document.querySelectorAll('.scale-time')
const scaleWeatherIcon = document.querySelectorAll('.weather')
const cityTimeContainer = document.querySelector('.time')
const alertCityNotFound = document.querySelector('.alert-city-not-found')
let toggleAmPm = 0
let cityNotFound = 1
const cityTimeMap = new Map()
let selectedCityId = 'nome'
const observer = new window.MutationObserver(updateTimelineHours)

// Method to create span element for displaying
/**
 *
 */
function timeElementCreation () {
  let timeSeconds = document.createElement('span')
  timeSeconds.innerHTML = ''
  cityTimeContainer.appendChild(timeSeconds)
  timeSeconds = document.createElement('span')
  timeSeconds.innerHTML = ''
  timeSeconds.classList.add('seconds')
  cityTimeContainer.appendChild(timeSeconds)
}

timeElementCreation()
const cityTime = document.querySelector('.time').children[0]
const citySeconds = document.querySelector('.seconds')
let currentHour = cityTime.innerHTML.split(':')
currentHour = currentHour[0]

// Method to call functions to update city details
/**
 *
 * @param {object} val - Specific City's key value pairs
 */
function cityUpdateFunctions (val) {
  selectedCityId = val.cityName.toLowerCase()
  cityTimeContainer.id = selectedCityId
  cityProtoFunctions.createCityObject(val)
  setTimeout(() => {
    updateTimelineHours()
  }, 100)
}

// Asynchronous Function to load json Data
/**
 *
 */
(async () => {
  const response = await fetch('./data.json')
  const jsonData = await response.json()
  datalistPopulate(jsonData)
  keepDatalistOptions('.drop-down', jsonData)
  middleSection.addFilterIconsListener(jsonData)
  middleSection.makeSunnyFilterIconDefault()
  bottomSection.sortOnClick(jsonData)
  cityUpdateFunctions(jsonData.nome)
  setTimeMap(jsonData)
})()

// Method to add option values from json to Datalist
/**
 *
 * @param {object} jsonData - Data loaded from json
 */
function datalistPopulate (jsonData) {
  for (const city in jsonData) {
    const option = document.createElement('option')
    option.value = jsonData[city].cityName
    cityValue.appendChild(option)
  }
}

// Changing City Image dynamically in top section
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
export function changeCityImg (jsonCityEntry) {
  if (jsonCityEntry === 'nil') { cityImage.src = '../Icons_for_cities/placeholder.png' } else {
    const cityImgSource = jsonCityEntry.url
    cityImage.src = '../Icons_for_cities/' + cityImgSource
  }
}

// Method to set AM or PM icon for city
/**
 *
 * @param {number} toggleAmPm - to identify 'am' or 'pm'
 */
function changeAmState (toggleAmPm) {
  if (isNaN(toggleAmPm)) {
    cityAmPm.src = ''
    cityAmPm.classList.remove('am-pm')
    cityAmPm.classList.add('am-pm-nil')
    cityTime.classList.add('time-nil')
  } else if (!toggleAmPm) {
    cityAmPm.src = '../General_Images_&_Icons/amState.svg'
    cityTime.classList.add('time-color-day')
    cityTime.classList.remove('time-color-night')
    cityTime.classList.remove('time-nil')
    citySeconds.style.color = '#FFD7DB'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
  } else {
    cityAmPm.src = '../General_Images_&_Icons/pmState.svg'
    cityTime.classList.add('time-color-night')
    cityTime.classList.remove('time-color-day')
    cityTime.classList.remove('time-nil')
    citySeconds.style.color = '#BFBFF6'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
  }
}

// Method to update forecasted values
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
export function changeForecastValues (jsonCityEntry) {
  forecastedValues[0].innerHTML = jsonCityEntry.temperature
  if (jsonCityEntry.cityName === 'NIL') {
    forecastedValues[1].innerHTML = jsonCityEntry.temperature
    forecastedValues[2].children[0].innerHTML = jsonCityEntry.humidity
    forecastedValues[3].children[0].innerHTML = jsonCityEntry.precipitation
    forecastedValues[2].children[1].innerHTML = ''
    forecastedValues[3].children[1].innerHTML = ''
  } else {
    const fahrenheit = unitFunctions.celsiusToFahrenheit(jsonCityEntry.temperature)
    forecastedValues[1].innerHTML = fahrenheit
    forecastedValues[2].children[0].innerHTML = jsonCityEntry.humidity.slice(0, -1)
    forecastedValues[3].children[0].innerHTML = jsonCityEntry.precipitation.slice(0, -1)
    forecastedValues[2].children[1].innerHTML = '%'
    forecastedValues[3].children[1].innerHTML = '%'
  }
}

// Method to update timeline for forecasting next 5 hours
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
export function changeForecastTimeline (jsonCityEntry) {
  if (jsonCityEntry.cityName !== 'NIL') {
    setTimeout(() => {
      changeTimelineHours()
    }, 100)
    changeTimelineTemperature(jsonCityEntry)
    changeTimelineIcon(jsonCityEntry)
  } else {
    for (let i = 0; i < scaleTime.length; i++) {
      scaleTime[i].innerHTML = 'NIL'
    }
    for (let i = 0; i < forecastedTemperature.length; i++) {
      forecastedTemperature[i].innerHTML = jsonCityEntry.nextFiveHrs[1]
    }
    for (let i = 0; i < scaleWeatherIcon.length; i++) {
      scaleWeatherIcon[i].src = '../General_Images_&_Icons/alert.png'
      scaleWeatherIcon[i].setAttribute('style', 'filter:grayscale(1);')
    }
  }
}

// Method to change next 5 hours in Forecast Timeline
/**
 *
 */
function changeTimelineHours () {
  let cityHour = parseInt(cityTime.innerHTML.slice(0, -3)) + 1
  const forecastAmPm = []
  forecastAmPm[0] = toggleAmPm
  if (cityHour === 12) {
    forecastAmPm[0] = !forecastAmPm[0]
  }
  forecastAmPm[1] = (forecastAmPm[0] ? ' PM' : ' AM')
  let i = 0; let j = 0
  const interval = setInterval(function () {
    scaleTime[j].innerHTML = '---'
    if (j >= 1) {
      if (cityHour > 12) { cityHour = 1 }
      if (cityHour === 12) {
        forecastAmPm[0] = !forecastAmPm[0]
        forecastAmPm[1] = (forecastAmPm[0] ? ' PM' : ' AM')
      }
      if (i === 0) { scaleTime[i].innerHTML = 'NOW' } else {
        scaleTime[i].innerHTML = cityHour + forecastAmPm[1]
        cityHour++
      }
      i++
    }
    if (j < 5) { j++ }
    if (i === 6) {
      clearInterval(interval)
    }
  }, 100)
}

// Method to change forecasted Temperature in Forecast Timeline
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
function changeTimelineTemperature (jsonCityEntry) {
  forecastedTemperature[0].innerHTML = jsonCityEntry.temperature
  for (let i = 1; i < forecastedTemperature.length; i++) {
    forecastedTemperature[i].innerHTML = jsonCityEntry.nextFiveHrs[i - 1]
  }
}

// Method to change weather icons in Forecast Timeline
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
function changeTimelineIcon (jsonCityEntry) {
  const cityTemperature = []
  cityTemperature[0] = parseInt(jsonCityEntry.temperature)
  for (let i = 0; i < jsonCityEntry.nextFiveHrs.length; i++) { cityTemperature[i + 1] = parseInt(jsonCityEntry.nextFiveHrs[i]) }
  for (let i = 0; i < cityTemperature.length; i++) {
    switch (true) {
      case cityTemperature[i] > 29:
        scaleWeatherIcon[i].src = '../Weather_Icons/sunnyIcon.svg'
        break
      case (cityTemperature[i] <= 29) && (cityTemperature[i] >= 23):
        scaleWeatherIcon[i].src = '../Weather_Icons/cloudyIcon.svg'
        break
      case (cityTemperature[i] <= 22) && (cityTemperature[i] >= 18):
        scaleWeatherIcon[i].src = '../Weather_Icons/windyIcon.svg'
        break
      default:
        scaleWeatherIcon[i].src = '../Weather_Icons/rainyIcon.svg'
    }
    scaleWeatherIcon[i].setAttribute('style', 'filter:grayscale(0);')
  }
}

// Method to blur and handle click event in Input tag for selecting city.
/**
 *
 * @param {string} selector - String to pass class name of Input tag
 * @param {object} jsonData - to pass Entire json Data
 */
function keepDatalistOptions (selector = '', jsonData) {
  // select all input fields by datalist attribute or by class/id
  const datalistInputs = document.querySelectorAll(selector)
  if (datalistInputs.length) {
    for (let i = 0; i < datalistInputs.length; i++) {
      const input = datalistInputs[i]
      input.addEventListener('change', function (e) {
        for (const city in jsonData) {
          if (e.target.value === jsonData[city].cityName) {
            const val = cityInput.value.toLowerCase()
            cityUpdateFunctions(jsonData[val])
            e.target.setAttribute('placeholder', e.target.value)
            e.target.blur()
            cityNotFound = 0
            break
          } else {
            cityNotFound = 1
          }
        }
        if (!cityNotFound) {
          alertCityNotFound.innerHTML = ''
        } else {
          e.target.value = 'NIL'
          e.target.setAttribute('placeholder', e.target.value)
          cityNotFound = 0
          cityUpdateFunctions(jsonData.nil)
        }
      })
      input.addEventListener('focus', function (e) {
        e.target.setAttribute('placeholder', e.target.value)
        e.target.value = ''
      })
      input.addEventListener('blur', function (e) {
        e.target.value = e.target.getAttribute('placeholder')
      })
      input.addEventListener(('keypress'), function (e) {
        if (e.key === 'Enter') {
          e.preventDefault()
          for (const city in jsonData) {
            if (e.target.value === jsonData[city].cityName) {
              cityNotFound = 0
              const val = cityInput.value.toLowerCase()
              cityUpdateFunctions(jsonData[val])
              break
            } else {
              cityNotFound = 1
            }
          }
          if (cityNotFound) {
            alertCityNotFound.innerHTML = `City '${e.target.value}' Not in List!`
            e.target.value = 'Not Found'
            e.target.setAttribute('placeholder', e.target.value)
            e.target.blur()
            cityUpdateFunctions(jsonData.nil)
          } else {
            alertCityNotFound.innerHTML = ''
          }
        }
      })
    }
  }
}

// Method to update Timeline Hours respective to live city time
/**
 *
 */
function updateTimelineHours () {
  let hourChangeIndicator = cityTime.innerHTML.split(':')
  hourChangeIndicator = hourChangeIndicator[0]
  if (hourChangeIndicator !== currentHour) {
    currentHour = hourChangeIndicator
    if (hourChangeIndicator === 'NIL') {
      for (let i = 0; i < scaleTime.length; i++) {
        scaleTime[i].innerHTML = 'NIL'
      }
    } else { changeTimelineHours() }
  }
}

// Method to create a Map consisting of cities associated with their respective Time Zones and calling time updating functions in a single set interval
/**
 *
 * @param {object} jsonData - to pass Entire json Data
 */
function setTimeMap (jsonData) {
  for (const city in jsonData) {
    const cityStartTime = startTime(jsonData[city].timeZone)
    cityTimeMap.set(city, [jsonData[city].timeZone, cityStartTime])
  }
  updateTimeCalls()
  setInterval(function () {
    updateTimeCalls()
  }, 100)
}

// Method to call Time and date updating functions for all displayed city information
/**
 *
 */
function updateTimeCalls () {
  updateSelectedCityTimeAndDate()
  updateDisplayedCardsTimeAndDate()
  updateContinentCardsTime()
}

// Method to update live time of cities displayed in bottom section
/**
 *
 */
function updateContinentCardsTime () {
  const continentTime = document.querySelectorAll('.continent-time')
  for (let i = 0; i < 12; i++) {
    const continentTimeZone = bottomSection.sortedCityArray[i].timeZone
    if (!(startTime(continentTimeZone) === undefined)) {
      let continentTimeWithSeconds = startTime(continentTimeZone).split(':')
      continentTimeWithSeconds = continentTimeWithSeconds[0] + ':' + continentTimeWithSeconds[1] + ' ' + continentTimeWithSeconds[2].split(' ')[1]
      continentTime[i].innerHTML = continentTimeWithSeconds
    }
  }
}

// Method to update live time and date of cities displayed in cards
/**
 *
 */
function updateDisplayedCardsTimeAndDate () {
  const cityCardTime = document.querySelectorAll('.city-time-card')
  const cityCardDate = document.querySelectorAll('.city-date-card')
  let index = 0
  for (const city in middleSection.filteredCityArray) {
    if (index === cityCardTime.length) { break }
    const cityCardTimeZone = cityTimeMap.get(middleSection.filteredCityArray[city])[0]
    let cardTimeWithSeconds = startTime(cityCardTimeZone).split(':')
    cardTimeWithSeconds = cardTimeWithSeconds[0] + ':' + cardTimeWithSeconds[1] + ' ' + cardTimeWithSeconds[2].split(' ')[1]
    if (cityCardTime[index] !== null || cityCardDate[index !== null]) {
      cityCardTime[index].innerHTML = cardTimeWithSeconds
      cityCardDate[index].innerHTML = getDate(cityCardTimeZone)
    }
    index++
  }
}

// Method to update live time and date of selected city in Top section
/**
 *
 */
function updateSelectedCityTimeAndDate () {
  let cityStartTime = cityTimeMap.get(selectedCityId)
  if (selectedCityId === 'nil') {
    cityTime.innerHTML = 'NIL'
    citySeconds.innerHTML = ''
    toggleAmPm = 'NIL'
    changeAmState(toggleAmPm)
    cityDate.innerHTML = ''
  } else {
    cityDate.innerHTML = getDate(cityStartTime[0], 1)
    cityStartTime = startTime(cityStartTime[0]).split(':')
    const cityTimeInHours = cityStartTime[0] + ':' + cityStartTime[1]
    const cityTimeInSeconds = ':' + cityStartTime[2].split(' ')[0]
    toggleAmPm = cityStartTime[2].split(' ')[1] === 'AM' ? 0 : 1
    changeAmState(toggleAmPm)
    cityTime.innerHTML = cityTimeInHours
    citySeconds.innerHTML = cityTimeInSeconds
  }
}

// Method to get Live Time of a City by passing it's Time Zone
/**
 * @returns {string} - live time of a city object
 * @param {string} cityTimeZone - timezone of a city object
 */
function startTime (cityTimeZone) {
  let liveTime = new Date().toLocaleString([], { timeZone: cityTimeZone })
  liveTime = liveTime.split('/')
  liveTime = unitFunctions.swapDateParts(liveTime)
  const liveTimeToDateObject = new Date(liveTime)
  const liveTimeToDateString = liveTimeToDateObject.toString()
  let liveTimeHour = parseInt(liveTimeToDateString.split(' ')[4].slice(0, -6))
  let liveTimeMinute = parseInt(liveTimeToDateString.split(' ')[4].slice(-5, -3))
  let ampm = ''
  ampm = liveTimeHour >= 12 ? 'PM' : 'AM'
  liveTimeHour = liveTimeHour % 12
  liveTimeHour = liveTimeHour || 12
  liveTimeHour = unitFunctions.addZeroToSingleDigitTime(liveTimeHour)
  liveTimeMinute = unitFunctions.addZeroToSingleDigitTime(liveTimeMinute)
  let liveTimeSeconds = liveTimeToDateObject.getSeconds()
  liveTimeSeconds = unitFunctions.addZeroToSingleDigitTime(liveTimeSeconds)
  const timeToString = liveTimeHour + ':' + liveTimeMinute + ':' + liveTimeSeconds + ' ' + ampm
  return timeToString
}

// Method to update Date for respective city
/**
 *
 * @returns {string} - live Date of a specified city
 * @param {string} cityTimeZone - timezone of a city
 * @param {number} flag - to know the caller of the function
 */
function getDate (cityTimeZone, flag) {
  let liveDate = new Date().toLocaleDateString([], { timeZone: cityTimeZone })
  liveDate = liveDate.split('/')
  liveDate = unitFunctions.swapDateParts(liveDate)
  const liveDateToDateObject = new Date(liveDate).toLocaleString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  let date = liveDateToDateObject.split(' ')
  if (flag === undefined) {
    date[1] = date[1].toUpperCase()
  }
  date = date.join('-')
  return date
}

observer.observe(cityTime, { childList: true })
