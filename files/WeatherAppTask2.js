import * as unitFunctions from './utils.js'

const filterIcons = document.querySelectorAll('.icons')
const cardRack = document.querySelector('.cards-rack')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const cardCardCount = document.querySelector('#counter-value')
const cardScrollerIcon = document.querySelectorAll('.card-scroller-icon')
export let filteredCityArray = []

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
      filterOnClick(index, jsonData)
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
  filteredCityArray = []
  switch (iconValue) {
    case 0:
      for (const city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].temperature))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]))
      for (const [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(unitFunctions.filterOnSunny)
      break
    case 1:
      for (const city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].precipitation))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]))
      for (const [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(unitFunctions.filterOnSnow)
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
      filteredCityArray = filteredCityArray.filter(unitFunctions.filterOnRainy)
      break
  }
  filteredCityArray.forEach((element, index) => {
    filteredCityArray[index] = filteredCityArray[index].cityName.toLowerCase()
  })
  getSpinnerValue(filteredCityArray, jsonData)
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
    createCardSection(citiesList, jsonData, spinnerValue)
  })
  createCardSection(citiesList, jsonData, spinnerValue)
}

// Method to call create card for filtered cities
/**
 *
 * @param {object} citiesList - array of filtered cities
 * @param {object} jsonData - Data loaded from json
 * @param {number} spinnerValue - Current value of counter input
 */
function createCardSection (citiesList, jsonData, spinnerValue) {
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
