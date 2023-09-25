const continentCityContainer = document.querySelector('.continent-city-container')
const sortContentContainer = document.querySelectorAll('.sort-content-container')
let orderOfSortByTemperature = true
let orderOfSortByContinentName = true
let sortedMap
export let sortedCityArray = []

// Method to create continent and city card
/**
 *
 * @param {object} jsonEntry - object consisiting data of a specific city
 */
export function createContinentCard (jsonEntry) {
  const continentName = jsonEntry.timeZone.split('/').slice(0, 1)
  const continentCard = `<div class="continent-city-self">
                        <p class="continent-name">${continentName}</p>
                        <p class="continent-temperature">${jsonEntry.temperature}</p>
                        <p class="continent-place-time">${jsonEntry.cityName}, <span class="continent-time"></span></p>
                        <div class="continent-humidity-container">
                            <img src="../Weather_Icons/humidityIcon.svg" alt="Rain-Drop" class="continent-humidity-icon">
                            <p class="icon-value-card">${jsonEntry.humidity}</p>
                        </div>
                      </div>`
  continentCityContainer.insertAdjacentHTML('afterbegin', continentCard)
}

// Method to add event listeners for sorting options
/**
 *
 * @param {object} jsonData - Data loaded from json
 */
export function sortOnClick (jsonData) {
  sortByContinentName(jsonData)
  sortContentContainer.forEach((element, index) => {
    if (index) {
      element.addEventListener('mouseup', function () {
        sortByTemp(jsonData)
      })
    } else {
      element.addEventListener('mouseup', function () {
        sortedMap = new Map()
        sortByContinentName(jsonData)
      })
    }
  })
}

// Method to sort cards by temperature
/**
 *
 * @param {object} jsonData - Data loaded from json
 * @param {number} flag - to pass the origin of function call
 */
function sortByTemp (jsonData, flag) {
  if (flag === 1) {
    orderOfSortByTemperature = !orderOfSortByTemperature
  }
  let index = -1
  const cityTemperatureMap = []
  const citySortedByTemp = []
  const cityGroupedByContinent = []
  sortedCityArray = []
  for (const [city, continent] of sortedMap) {
    const last = cityGroupedByContinent[cityGroupedByContinent.length - 1]
    if (!last || JSON.stringify(continent).localeCompare(JSON.stringify(last[0]))) {
      cityTemperatureMap[++index] = []
      citySortedByTemp.push(cityTemperatureMap[index])
      cityTemperatureMap[index].push([city, parseInt(jsonData[city].temperature)])
      cityGroupedByContinent.push([continent])
    } else {
      cityTemperatureMap[index].push([city, parseInt(jsonData[city].temperature)])
      last.push(continent)
    }
  }
  citySortedByTemp.forEach((element, index) => {
    if (orderOfSortByTemperature) {
      citySortedByTemp[index] = element.sort((a, b) => a[1] - b[1])
    } else {
      citySortedByTemp[index] = element.sort((a, b) => b[1] - a[1])
    }
    element.forEach((element) => {
      sortedCityArray.push(jsonData[element[0]])
    })
  })

  if (orderOfSortByTemperature) {
    sortContentContainer[1].children[1].src = '../General_Images_&_Icons/arrowDown.svg'
  } else {
    sortContentContainer[1].children[1].src = '../General_Images_&_Icons/arrowUp.svg'
  }

  orderOfSortByTemperature = !orderOfSortByTemperature
  createContinentCardSection(sortedCityArray)
}

// Method to sort cards by continent Name
/**
 *
 * @param {object} jsonData - Data loaded from json
 */
function sortByContinentName (jsonData) {
  const cityContinentMap = new Map()
  sortedCityArray = []
  for (const city in jsonData) {
    if (city !== 'nil') { cityContinentMap.set(city, jsonData[city].timeZone.split('/').slice(0, 1)) }
  }
  if (orderOfSortByContinentName) {
    sortedMap = new Map([...cityContinentMap.entries()].sort((a, b) => {
      return (a[1] > b[1]) ? 1 : -1
    }))
    sortContentContainer[0].children[1].src = '../General_Images_&_Icons/arrowUp.svg'
  } else {
    sortedMap = new Map([...cityContinentMap.entries()].sort((a, b) => (a[1] > b[1]) ? -1 : 1))
    sortContentContainer[0].children[1].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  orderOfSortByContinentName = !orderOfSortByContinentName
  for (const [key] of sortedMap) {
    sortedCityArray.push(jsonData[key])
  }
  sortByTemp(jsonData, 1)
}

// Method to call create cards for continent-wise display of cities
/**
 *
 * @param {object} citiesList - Array of sorted city names
 */
function createContinentCardSection (citiesList) {
  continentCityContainer.innerHTML = ''
  for (let i = 11; i >= 0; i--) {
    createContinentCard(citiesList[i])
  }
}
