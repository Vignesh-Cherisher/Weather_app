const cityImage = document.querySelector('#city-image').children[0]
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')
const cityValue = document.querySelector('#cities')
const cityInput = document.getElementsByClassName('drop-down')[0]
const cityDate = document.querySelector('#date')
const cityTime = document.querySelector('.time').children[0]
const citySeconds = document.querySelector('#seconds')
const cityAmPm = document.querySelector('#am-pm')
const forecastedValues = document.querySelectorAll('.forecast-values')
const forecastedTemperature = document.querySelectorAll('.forecast-temperature')
const scaleTime = document.querySelectorAll('.scale-time')
const scaleWeatherIcon = document.querySelectorAll('.weather')
let toggleAmPm = 0
;

// Asynchronous Function to load json Data
/**
 *
 */
(async () => {
  const response = await fetch('./data.json')
  const jsonData = await response.json()
  datalistPopulate(jsonData)
  keepDatalistOptions('.drop-down', jsonData)
  changeCityImg(jsonData.nil)
  changeCityDateTime(jsonData.nil)
  changeForecastValues(jsonData.nil)
  changeForecastTimeline(jsonData.nil)
  citySelect(jsonData)
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

// Method to call Functions for updating values whenever City name is changed
/**
 *
 * @param {object} jsonData - Data loaded from json
 */
function citySelect (jsonData) {
  cityInput.addEventListener('input', function (event) {
    for (const city in jsonData) {
      if (event.target.value === jsonData[city].cityName) {
        const val = cityInput.value.toLowerCase()
        changeCityImg(jsonData[val])
        changeCityDateTime(jsonData[val])
        changeForecastValues(jsonData[val])
        changeForecastTimeline(jsonData[val])
      }
    }
  })
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
    updateCityTime(jsonTime)
    runCityTime(jsonTime, cityName)
  }
}

// Method to update city time
/**
 *
 * @param {object} liveTime - to pass Time object for live time
 */
function updateCityTime (liveTime) {
  cityTime.innerHTML = liveTime.slice(0, -3)
  citySeconds.innerHTML = liveTime.slice(-3)
}

// Method to run Live Time of selected City
/**
 *
 * @param {object} liveTime - to pass Time object for live time
 * @param {string} cityName - to pass selected city name
 */
function runCityTime (liveTime, cityName) {
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
    cityAmPm.src = '../General_Images_&_Icons/ampmState.png'
    cityAmPm.classList.remove('am-pm')
    cityAmPm.classList.add('am-pm-nil')
    cityTime.classList.add('time-gradient')
    cityTime.setAttribute('style', '-webkit-background-clip:text')
  } else if (!toggleAmPm) {
    cityAmPm.src = '../General_Images_&_Icons/amState.svg'
    cityTime.style.color = '#ffe5b4'
    citySeconds.style.color = '#ffe5b4'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    cityTime.classList.remove('time-gradient')
    toggleAmPm = !toggleAmPm
  } else {
    cityAmPm.src = '../General_Images_&_Icons/pmState.svg'
    cityTime.style.color = '#1E90FF'
    citySeconds.style.color = '#1E90FF'
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    cityTime.classList.remove('time-gradient')
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
  if (jsonCityEntry.cityName === 'NIL') { forecastedValues[1].innerHTML = jsonCityEntry.temperature.slice(0, -2) + ' F' } else {
    const fahrenheit = ((parseInt(jsonCityEntry.temperature) * 1.8) + 32).toFixed(0) + ' F'
    forecastedValues[1].innerHTML = fahrenheit
  }
  forecastedValues[2].children[0].innerHTML = jsonCityEntry.humidity.slice(0, -1)
  forecastedValues[3].children[0].innerHTML = jsonCityEntry.precipitation.slice(0, -1)
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
      scaleTime[i].innerHTML = '♾️'
    }
    for (let i = 0; i < forecastedTemperature.length; i++) {
      forecastedTemperature[i].innerHTML = jsonCityEntry.nextFiveHrs[1]
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
  for (let i = 0; i < scaleTime.length; i++) {
    if (cityHour > 12) { cityHour = 1 }
    if (cityHour === 12) {
      forecastAmPm[0] = !forecastAmPm[0]
      forecastAmPm[1] = (forecastAmPm[0] ? ' PM' : ' AM')
    }
    scaleTime[i].innerHTML = cityHour + forecastAmPm[1]
    cityHour++
  }
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
    if (cityTemperature[i] > 29) { scaleWeatherIcon[i].src = '../Weather_Icons/sunnyIcon.svg' } else if ((cityTemperature[i] <= 29) && (cityTemperature[i] >= 23)) { scaleWeatherIcon[i].src = '../Weather_Icons/cloudyIcon.svg' } else if ((cityTemperature[i] <= 22) && (cityTemperature[i] >= 18)) { scaleWeatherIcon[i].src = '../Weather_Icons/windyIcon.svg' } else { scaleWeatherIcon[i].src = '../Weather_Icons/precipitationIcon.svg' }
  }
}

/**
 * Method to scroll Middle section both Horizontally and Vertically
 * @param {object} target - target element
 * @param {object} targetContainer - underlying container
 */
function yScroll (target, targetContainer) {
  target.addEventListener('wheel', (evt) => {
    evt.preventDefault()
    if (evt.deltaY !== 0) {
      window.scrollBy({
        top: evt.deltaY
      })
    }
    if (evt.deltaX !== 0) {
      targetContainer.scrollLeft += evt.deltaX
    }
  })
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
      input.addEventListener('input', function (e) {
        for (const city in jsonData) {
          if (e.target.value === jsonData[city].cityName) {
            e.target.setAttribute('placeholder', e.target.value)
            e.target.blur()
          }
        }
      })
      input.addEventListener('focus', function (e) {
        e.target.setAttribute('placeholder', e.target.value)
        e.target.value = ''
      })
      input.addEventListener('blur', function (e) {
        e.target.value = e.target.getAttribute('placeholder')
      })
    }
  }
}

for (let i = 0; i < scrollable.length; i++) {
  yScroll(scrollable[i], scrollRack)
}

yScroll(scrollOverlay[0], scrollRack)
