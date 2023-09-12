const cityImage = document.querySelector('#city-image').children[0]
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')
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
const filterIcons = document.querySelectorAll('.icons')
let toggleAmPm = 0
let cityNotFound = 0

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
  createCard(val)
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
  addFilterIconsListener(jsonData)
  cityUpdateFunctions(jsonData.nome)
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
        notFoundCity = 1
        const val = cityInput.value.toLowerCase()
        cityUpdateFunctions(jsonData[val])
      }
    }
    if(notFoundCity)
      alertCityNotFound.innerHTML = ""
  })    
  cityInput.addEventListener(('keypress'),function(e) {
    if(e.key === 'Enter'){
      e.preventDefault()
      for (const city in jsonData) {
        if (e.target.value === jsonData[city].cityName) {
          notFoundCity = 1
          const val = cityInput.value.toLowerCase()
          cityUpdateFunctions(jsonData[val])
        }
        else
          notFoundCity = 0
      }
      if(notFoundCity === 0){
        alertCityNotFound.innerHTML = "City Not in List!"
      }
    }
    if(notFoundCity)
      alertCityNotFound.innerHTML = ""
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
    cityAmPm.src = '../General_Images_&_Icons/ampmState.png'
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

//'-------------------------------------------------------------------------------------------------------'

const cardRack = document.querySelector('.cards-rack')

// Method to return livetime for provided Timezone
function startTime(val) {
  if (val == 'NIL') {

  }
  else {
    let liveTime = new Date().toLocaleString([], { timeZone: val });
    let liveTimeToDateObject = new Date(liveTime);
    let liveTimeHour = liveTimeToDateObject.getHours();
    let liveTimeMinute = liveTimeToDateObject.getMinutes();
    function checkTime(i) {
      if (i < 10) { i = "0" + i; }
      return i;
    }
    let ampm = "";
    if (true) {
      ampm = liveTimeHour >= 12 ? "PM" : "AM";
      liveTimeHour = liveTimeHour % 12;
      liveTimeHour = liveTimeHour ? liveTimeHour : 12;
    }
    liveTimeHour = checkTime(liveTimeHour)
    liveTimeMinute = checkTime(liveTimeMinute)
    let timeToString = liveTimeHour + ":" + liveTimeMinute + ' ' + ampm;
    return timeToString
  }
}

// Method to update live time whenever a new card is created
function runTimeForCards(val,cityCardTime) {
  cityCardTime.innerHTML = startTime(val);
  t = setInterval(function () {
    if (!(startTime(val) === undefined)) {
      cityCardTime.innerHTML = startTime(val);
    }
  }, 1000)
}

function swapDateParts(liveDate) {
  let temp = liveDate[0]
  liveDate[0] = liveDate[1]
  liveDate[1] = temp
  liveDate = liveDate.join([separator = '/'])
  return liveDate
}

// Method to update Date for respective city
function getDate(val) {
  let liveDate = new Date().toLocaleDateString([], { timeZone: val });
  liveDate = liveDate.split('/')
  liveDate = swapDateParts(liveDate)
  let liveDateToDateObject = new Date(liveDate).toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let date = liveDateToDateObject.split(' ')
  date[1] = date[1].toUpperCase()
  date = date.join([separator = '-'])
  return date
}

// Method to update Date for selected card
function getDateForCards(val, cityCardDate) {
  cityCardDate.innerHTML = getDate(val);
  t = setInterval(function () {
    cityCardDate.innerHTML = getDate(val);
  }, 10000)
}

// Method to create a card to display city details.
function createCard(jsonCityEntry) {
  const card = document.createElement('div')
  const cardBgImage = document.createElement('img')
  const cardFirstColumn = document.createElement('div')
  const cardSecondColumn = document.createElement('div')
  const cityCardName = document.createElement('p')
  const cityCardTime = document.createElement('p')
  const cityCardDate = document.createElement('p')
  const cityCardCelsiusHolder = document.createElement('div')
  const cityCardCelsiusIcon = document.createElement('img')
  const cityCardCelsiusValue = document.createElement('p')

  card.classList.add('card-self')
  cardBgImage.classList.add('card-bg-image')
  cardFirstColumn.classList.add('columns-card')
  cardSecondColumn.classList.add('columns-card')
  cityCardName.classList.add('city-name-card')
  cityCardTime.classList.add('city-time-card')
  cityCardDate.classList.add('city-date-card')
  cityCardCelsiusHolder.classList.add('celsius-holder-card')
  cityCardCelsiusIcon.classList.add('celsius-content-card')
  cityCardCelsiusValue.classList.add('celsius-value-card')

  cardBgImage.src = "../Icons_for_cities/" + jsonCityEntry.url
  cityCardName.innerHTML = jsonCityEntry.cityName
  runTimeForCards(jsonCityEntry.timeZone, cityCardTime)
  getDateForCards(jsonCityEntry.timeZone, cityCardDate)
  cityCardCelsiusIcon.src = "../Weather_Icons/sunnyIcon.svg"
  cityCardCelsiusValue.innerHTML = jsonCityEntry.temperature;


  card.append(cardBgImage, cardFirstColumn, cardSecondColumn)
  cardFirstColumn.append(cityCardName, cityCardTime, cityCardDate)
  cardSecondColumn.appendChild(cityCardCelsiusHolder)
  cityCardCelsiusHolder.append(cityCardCelsiusIcon, cityCardCelsiusValue)

  for (let i = 0; i < 2; i++){
    const cityCardIconHolder = document.createElement('div')
    const cityCardWeatherIcon = document.createElement('img')
    const cityCardIconValue = document.createElement('p')

    cityCardIconHolder.classList.add('icons-holder-card')
    cityCardWeatherIcon.classList.add('icon-content-card')
    cityCardIconValue.classList.add('icon-value-card')
    if (i) {
      cityCardWeatherIcon.src = "../Weather_Icons/precipitationIcon.svg"
      cityCardIconValue.innerHTML = jsonCityEntry.precipitation;
    }
    else {
      cityCardWeatherIcon.src = "../Weather_Icons/humidityIcon.svg"
      cityCardIconValue.innerHTML = jsonCityEntry.humidity;
    }

    cardFirstColumn.appendChild(cityCardIconHolder)
    cityCardIconHolder.append(cityCardWeatherIcon, cityCardIconValue)
  }
  
  cardRack.appendChild(card)
}

function addFilterIconsListener(jsonData) {
  filterIcons.forEach( (element,index) => {
    element.addEventListener('click', () => {
      filterOnClick(index, jsonData)
    })
  })
}

function filterOnClick(iconValue, jsonData) {
  let cityTemperatureMap = []
  for (let city in jsonData) {
    if (!iconValue) {
      if ((parseInt(jsonData[city].temperature) > 29) && (parseInt(jsonData[city].humidity) < 50) && (parseInt(jsonData[city].precipitation) >= 50 )) {
        console.log(jsonData[city]);
      }
    }
  }
}