const filterIcons = document.querySelectorAll('.icons')
const cardRack = document.querySelector('.cards-rack')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const cardCardCount = document.querySelector('#counter-value')
const cardScrollerIcon = document.querySelectorAll('.card-scroller-icon')
let setIntervalFlag = 0

// Method to return livetime for provided Timezone
/**
 *
 * @returns {string} - Live time in string Format
 * @param {string} cityTimeZone - passing specified city TimeZone
 * @param {object} cityTime - HTML element displaying hour and minute of a city
 * @param {object} citySeconds - HTML element displaying seconds of a city
 */
export function startTime (cityTimeZone, cityTime, citySeconds) {
  let liveTime = new Date().toLocaleString([], { timeZone: cityTimeZone })
  liveTime = liveTime.split('/')
  liveTime = swapDateParts(liveTime)
  const liveTimeToDateObject = new Date(liveTime)
  let liveTimeHour = liveTimeToDateObject.getHours()
  let liveTimeMinute = liveTimeToDateObject.getMinutes()

  // Method to append '0' if the time comprises of a single digit.
  /**
   *
   * @returns {string} - passed string appended with '0' if needed
   * @param {string} i - to pass live time as string
   */
  function checkTime (i) {
    if (i < 10) { i = '0' + i }
    return i
  }
  let ampm = ''
  ampm = liveTimeHour >= 12 ? 'PM' : 'AM'
  liveTimeHour = liveTimeHour % 12
  liveTimeHour = liveTimeHour || 12
  liveTimeHour = checkTime(liveTimeHour)
  liveTimeMinute = checkTime(liveTimeMinute)
  if (cityTime !== undefined) {
    let liveTimeSeconds = liveTimeToDateObject.getSeconds()
    liveTimeSeconds = checkTime(liveTimeSeconds)
    citySeconds.innerHTML = ':' + liveTimeSeconds
    cityTime.innerHTML = liveTimeHour + ':' + liveTimeMinute
    if (ampm === 'AM') {
      return 0
    } else {
      return 1
    }
  }
  const timeToString = liveTimeHour + ':' + liveTimeMinute + ' ' + ampm
  return timeToString
}

// Method to swap Month variable and Date variable for proper tolocaleString() execution
/**
 *
 * @returns {object} - live Date in mm/dd/yyyy format
 * @param {object} liveDate - live Date of a city in dd/mm/yyyy format
 */
export function swapDateParts (liveDate) {
  const temp = liveDate[0]
  liveDate[0] = liveDate[1]
  liveDate[1] = temp
  liveDate = liveDate.join('/')
  return liveDate
}

// Method to update Date for respective city
/**
 *
 * @returns {string} - live Date of a specified city
 * @param {string} cityTimeZone - timezone of a city
 * @param {number} flag - to know the caller of the function
 */
export function getDate (cityTimeZone, flag) {
  let liveDate = new Date().toLocaleDateString([], { timeZone: cityTimeZone })
  liveDate = liveDate.split('/')
  liveDate = swapDateParts(liveDate)
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

// Method to update live time and date whenever a new card is created
/**
 *
 * @param {string} cityTimeZone - passing specified city TimeZone
 * @param {object} cityCardTime - HTML element to display live Time of a city card
 * @param {object} cityCardDate - HTML element to display live Date of a city card
 */
function runTimeDateForCards (cityTimeZone, cityCardTime, cityCardDate) {
  cityCardTime.innerHTML = startTime(cityTimeZone)
  const t = setInterval(function () {
    if (setIntervalFlag === 1) {
      clearInterval(t)
    }
    if (!(startTime(cityTimeZone) === undefined)) {
      cityCardTime.innerHTML = startTime(cityTimeZone)
      cityCardDate.innerHTML = getDate(cityTimeZone)
    }
  }, 100)
}

// Method to create a card to display city details.
/**
 *
 * @param {object} jsonCityEntry - Specific City's key value pairs
 */
function createCard (jsonCityEntry) {
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

  cardBgImage.src = '../Icons_for_cities/' + jsonCityEntry.url
  cityCardName.innerHTML = jsonCityEntry.cityName
  runTimeDateForCards(jsonCityEntry.timeZone, cityCardTime, cityCardDate)
  cityCardCelsiusIcon.src = '../Weather_Icons/sunnyIcon.svg'
  cityCardCelsiusValue.innerHTML = jsonCityEntry.temperature

  card.append(cardBgImage, cardFirstColumn, cardSecondColumn)
  cardFirstColumn.append(cityCardName, cityCardTime, cityCardDate)
  cardSecondColumn.appendChild(cityCardCelsiusHolder)
  cityCardCelsiusHolder.append(cityCardCelsiusIcon, cityCardCelsiusValue)

  for (let i = 0; i < 2; i++) {
    const cityCardIconHolder = document.createElement('div')
    const cityCardWeatherIcon = document.createElement('img')
    const cityCardIconValue = document.createElement('p')

    cityCardIconHolder.classList.add('icons-holder-card')
    cityCardWeatherIcon.classList.add('icon-content-card')
    cityCardIconValue.classList.add('icon-value-card')
    if (i) {
      cityCardWeatherIcon.src = '../Weather_Icons/precipitationIcon.svg'
      cityCardIconValue.innerHTML = jsonCityEntry.precipitation
    } else {
      cityCardWeatherIcon.src = '../Weather_Icons/humidityIcon.svg'
      cityCardIconValue.innerHTML = jsonCityEntry.humidity
    }
    cardFirstColumn.appendChild(cityCardIconHolder)
    cityCardIconHolder.append(cityCardWeatherIcon, cityCardIconValue)
  }
  cardRack.appendChild(card)
  yScroll(card, cardRack)
}

// Method to add click listener and call filter function on icon click
/**
 *
 * @param {object} jsonData - Data loaded from json
 */
export function addFilterIconsListener (jsonData) {
  filterIcons.forEach((element, index) => {
    element.addEventListener('click', () => {
      for (let i = 0; i < 3; i++) {
        if (i === index) {
          filterIcons[i].classList.add('active-filter-icon')
        } else {
          filterIcons[i].classList.remove('active-filter-icon')
        }
      }
      setIntervalFlag = 1
      setTimeout(() => {
        setIntervalFlag = 0
        filterOnClick(index, jsonData)
      }, '100')
    })
  })
}

// Method to filter cities based on given conditions for creating Cards
/**
 *
 * @param {number} iconValue - number associated with each icons to know which icon is clicked
 * @param {object} jsonData - Data loaded from json
 */
function filterOnClick (iconValue, jsonData) {
  const cityValueMap = new Map()
  let sortedMap
  let filteredCityArray = []
  switch (iconValue) {
    case 0:
      for (const city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].temperature))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]))
      for (const [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnSunny)
      break
    case 1:
      for (const city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].precipitation))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]))
      for (const [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnSnow)
      break
    case 2:
      for (const city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].humidity))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]))
      for (const [key] of sortedMap) {
        if ((parseInt(jsonData[key].temperature) < 20) && (parseInt(jsonData[key].humidity) >= 50)) {
          filteredCityArray.push(key)
        }
      }
      for (const [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnCloudy)
      break
  }
  filteredCityArray.forEach((element, index) => {
    filteredCityArray[index] = filteredCityArray[index].cityName.toLowerCase()
  })
  getSpinnerValue(filteredCityArray, jsonData)
}

// Filter method to filter for Sunny Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
function filterOnSunny (cityPair) {
  return (parseInt(cityPair.temperature)) > 29
}

// Filter method to filter for Snowy Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
function filterOnSnow (cityPair) {
  return (parseInt(cityPair.temperature) >= 20 && parseInt(cityPair.temperature) < 29) && (parseInt(cityPair.humidity) > 50) && (parseInt(cityPair.precipitation) < 50)
}

// Filter method to filter for Cloudy Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
function filterOnCloudy (cityPair) {
  return ((parseInt(cityPair.temperature) < 20) && (parseInt(cityPair.humidity) >= 50))
}

// Method to set sunny icon as default icon and filter the cards based on it
/**
 *
 */
export function makeSunnyFilterIconDefault () {
  filterIcons[0].click()
  filterIcons[0].classList.add('active-filter-icon')
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

yScroll(scrollOverlay[0], cardRack)

// Method to get current Spinner Value
/**
 *
 * @param {object} citiesList - array of filtered cities
 * @param {object} jsonData - Data loaded from json
 */
function getSpinnerValue (citiesList, jsonData) {
  let spinnerValue = cardCardCount.value
  cardCardCount.addEventListener('change', (e) => {
    if (e.target.value < 3) {
      e.target.value = 3
    } else if (e.target.value > 10) {
      e.target.value = 10
    }
    spinnerValue = e.target.value
    createCards(citiesList, jsonData, spinnerValue)
  })
  createCards(citiesList, jsonData, spinnerValue)
}

// Method to call create card for filtered cities
/**
 *
 * @param {object} citiesList - array of filtered cities
 * @param {object} jsonData - Data loaded from json
 * @param {number} spinnerValue - Current value of counter input
 */
function createCards (citiesList, jsonData, spinnerValue) {
  cardRack.innerHTML = ''
  citiesList.forEach((element, index) => {
    if (parseInt(spinnerValue) > index) {
      createCard(jsonData[element])
    }
  })
  changeCardRackStyle()
  scrollOnClick()
}

window.onresize = function () {
  changeCardRackStyle()
}

// Method to style Card Rack according to its width:
/**
 *
 */
function changeCardRackStyle () {
  const cardRackWidth = cardRack.scrollWidth - cardRack.clientWidth
  if (cardRackWidth <= 0) {
    cardScrollerIcon[0].style.display = 'none'
    cardScrollerIcon[1].style.display = 'none'
    cardRack.classList.add('flex-space-evenly')
    cardRack.classList.remove('flex-space-between')
  } else {
    cardScrollerIcon[0].style.display = 'block'
    cardScrollerIcon[1].style.display = 'block'
    cardRack.classList.add('flex-space-between')
    cardRack.classList.remove('flex-space-evenly')
  }
}

// Method to scroll the cards on clicking arrow icons
/**
 *
 */
function scrollOnClick () {
  cardScrollerIcon.forEach((element, index) => {
    element.addEventListener('click', () => {
      const cardMargin = (window.getComputedStyle(cardRack.children[0]).marginLeft)
      const cardWidth = cardRack.children[0].getBoundingClientRect().width + 2 * parseInt(cardMargin)
      if (index) {
        cardRack.scrollBy({
          left: cardWidth,
          behavior: 'smooth'
        })
      } else {
        cardRack.scrollBy({
          left: -cardWidth,
          behavior: 'smooth'
        })
      }
    })
  })
}
