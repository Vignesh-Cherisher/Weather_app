import * as middleSection from './WeatherAppTask2.js'

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

//Method to create span element for displaying
/**
 *
 */
function timeElementCreation (){
  let timeSeconds = document.createElement('span')
  timeSeconds.innerHTML = "10:10"
  cityTimeContainer.appendChild(timeSeconds)
  timeSeconds = document.createElement('span')
  timeSeconds.innerHTML = ":46"
  timeSeconds.classList.add("seconds")
  cityTimeContainer.appendChild(timeSeconds)
}

timeElementCreation()
const cityTime = document.querySelector('.time').children[0]
const citySeconds = document.querySelector('.seconds')
;

// Method to call functions to update city details
/**
 * 
 */
function cityUpdateFunctions(val) {
  changeCityImg(val)
  changeCityDateTime(val)
  changeForecastValues(val)
  changeForecastTimeline(val)
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
  cityUpdateFunctions(jsonData.nome)
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
function changeCityImg (jsonCityEntry) {
  if (jsonCityEntry === 'nil') { cityImage.src = '../Icons_for_cities/placeholder.png' } else {
    const cityImgSource = jsonCityEntry.url
    cityImage.src = '../Icons_for_cities/' + cityImgSource
  }
}

// Method to get and parse time and Date of selected cities
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
function changeCityDateTime (jsonCityEntry) {
  let jsonDateTime = jsonCityEntry.dateAndTime
  jsonDateTime = jsonDateTime.split(' ')
  const jsonTime = jsonDateTime[1]
  const jsonDate = jsonDateTime[0].slice(0, -1)
  if (jsonDateTime[2] === 'AM') { toggleAmPm = 0 } else { toggleAmPm = 1 }
  if (jsonCityEntry.cityName === 'NIL') { changeAmState(NaN) } else { changeAmState(toggleAmPm) }
  changeCityTime(jsonTime, jsonCityEntry.cityName)
  changeCityDate(jsonDate, jsonCityEntry.cityName)
}

// Method to call functions to change City Time
/**
 *
 * @param {string} jsonTime - to pass selected city time
 * @param {string} cityName - to pass selected city name
 */
function changeCityTime (jsonTime, cityName) {
  if (isNaN(parseInt(jsonTime))) {
    cityTime.innerHTML = jsonTime
    citySeconds.innerHTML = ''
  } else {
    if (cityName !== cityInput.placeholder) {
      updateCityTime(jsonTime)
      runCityTime(jsonTime, cityName)
    }
  }
}

// Method to update city time
/**
 *
 * @param {object} liveTime - to pass Time object for live time
 */
function updateCityTime(liveTime) {
    cityTime.innerHTML = liveTime.slice(0, -3)
    citySeconds.innerHTML = liveTime.slice(-3)  
}

// Method to run Live Time of selected City
/**
 *
 * @param {object} liveTime - to pass Time object for live time
 * @param {string} cityName - to pass selected city name
 */
function runCityTime (liveTime, cityName ) {
  liveTime = liveTime.split(':')
  liveTime.forEach((element, index) => {
    liveTime[index] = parseInt(element)
  })
  const interval = setInterval(function () {
    if ((cityName !== cityInput.value) && (cityName !== cityInput.placeholder)) {
      cityName = cityInput.value
      clearInterval(interval)
    } else { updateCityTime(incrementSecond(liveTime)) }
  }, 1000)
}

// Method to increment Second
/**
 * @returns {object} - return live time after updation
 * @param {object} liveTime - to pass Time object for live time
 */
function incrementSecond (liveTime) {
  if (liveTime[2] >= 59) {
    incrementMinute(liveTime)
    liveTime[2] = 0
  } else { liveTime[2]++ }
  // Convert each element to String and add leading zeroes if necessary
  liveTime.forEach((element, index) => {
    liveTime[index] = element.toString()
    if (liveTime[index].length < 2 && index !== 0) { liveTime[index] = '0' + element }
  })
  liveTime = liveTime.join(':')
  return liveTime
}

// Method to increment Minute
/**
 * @returns {object} - return live time after updation
 * @param {object} liveTime - to pass Time object for live time
 */
function incrementMinute (liveTime) {
  if (liveTime[1] >= 59) {
    incrementHour(liveTime)
    liveTime[1] = 0
  } else { liveTime[1]++ }
  return liveTime
}

// Method to increment Hour
/**
 * @returns {object} - return live time after updation
 * @param {object} liveTime - to pass Time object for live time
 */
function incrementHour (liveTime) {
  if (liveTime[0] >= 12) {
    changeAmState(!toggleAmPm)
    liveTime[0] = 1
  } else { liveTime[0]++ }
  return liveTime
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
    citySeconds.style.color = '#FFD7DB'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    cityTime.classList.remove('time-nil')
    toggleAmPm = !toggleAmPm
  } else {
    cityAmPm.src = '../General_Images_&_Icons/pmState.svg'
    cityTime.classList.add('time-color-night')
    cityTime.classList.remove('time-color-day')
    citySeconds.style.color = '#BFBFF6'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    cityTime.classList.remove('time-nil')
    toggleAmPm = !toggleAmPm
  }
}

// Method to update City date
/**
 *
 * @param {object} jsonDate - to pass selected city date
 * @param {string} cityName - to pass selected city name
 */
function changeCityDate (jsonDate, cityName) {
  if (cityName === 'NIL') {
    cityDate.innerHTML = jsonDate
  } else {
    const dateParts = jsonDate.split('/')
    let cityDateVar = new Date(+dateParts[2], dateParts[0] - 1, +dateParts[1])
    cityDateVar = cityDateVar.toString().split(' ')
    cityDate.innerHTML = cityDateVar[2] + '-' + cityDateVar[1] + '-' + cityDateVar[3]
  }
}

// Method to update forecasted values
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
function changeForecastValues (jsonCityEntry) {
  forecastedValues[0].innerHTML = jsonCityEntry.temperature
  if (jsonCityEntry.cityName === 'NIL') { 
    forecastedValues[1].innerHTML = jsonCityEntry.temperature 
    forecastedValues[2].children[0].innerHTML = jsonCityEntry.humidity
    forecastedValues[3].children[0].innerHTML = jsonCityEntry.precipitation
    forecastedValues[2].children[1].innerHTML = ''
    forecastedValues[3].children[1].innerHTML = ''
  } else {
    const fahrenheit = ((parseInt(jsonCityEntry.temperature) * 1.8) + 32).toFixed(0) + ' F'
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
function changeForecastTimeline (jsonCityEntry) {
  if (jsonCityEntry.cityName !== 'NIL') {
    changeTimelineHours()
    changeTimelineTemperature(jsonCityEntry)
    changeTimelineIcon(jsonCityEntry)
  } else {
    for (let i = 0; i < scaleTime.length; i++) {
      scaleTime[i].innerHTML = 'NIL'
    }
    for (let i = 0; i < forecastedTemperature.length; i++) {
      forecastedTemperature[i].innerHTML = jsonCityEntry.nextFiveHrs[1]
    }
    for (let i = 0; i < scaleWeatherIcon.length; i++){
      scaleWeatherIcon[i].src = "../General_Images_&_Icons/alert.png"
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
  forecastAmPm[1] = (toggleAmPm ? ' PM' : ' AM')
  let i = 0, j = 0
  const interval = setInterval(function () {
    scaleTime[j].innerHTML = '---'
    if(j>=1){
      if (cityHour > 12) { cityHour = 1 }
      if (cityHour === 12) {
        forecastAmPm[0] = !forecastAmPm[0]
        forecastAmPm[1] = (forecastAmPm[0] ? ' PM' : ' AM')
      }
      if(i===0) { scaleTime[i].innerHTML = 'NOW' }
      else {
        scaleTime[i].innerHTML = cityHour + forecastAmPm[1]
        cityHour++ 
      }
      i++
    }
    if(j<5)
      j++
    if(i===6){
      clearInterval(interval);
    }
  }, 200)
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
        console.log(e.target.placeholder, e.target.value);
        for (const city in jsonData) {
          if (e.target.value === jsonData[city].cityName) {
            const val = cityInput.value.toLowerCase()
            cityUpdateFunctions(jsonData[val])
            e.target.setAttribute('placeholder', e.target.value)
            e.target.blur()
            cityNotFound = 0
            break
          }
          else {
            cityNotFound = 1
          }
        }
        if (!cityNotFound) {
          alertCityNotFound.innerHTML = ""
        }
        else {
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
            }
            else {
              cityNotFound = 1
            }
          }
          if (cityNotFound) {
            alertCityNotFound.innerHTML =`City '${e.target.value}' Not in List!`
            e.target.value = 'Not Found'
            e.target.setAttribute('placeholder', e.target.value)
            e.target.blur()
            cityUpdateFunctions(jsonData.nil)
          }
          else {
            alertCityNotFound.innerHTML = ""
          }
        }
      })
    }
  }
}

//'-------------------------------------------------------------------------------------------------------'