const continentCityContainer = document.querySelector('.continent-city-container')
const sortContentContainer = document.querySelectorAll('.sort-content-container')
let orderOfSortByTemperature = true
let orderOfSortByContinentName = true
let sortedContinentArray = []
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
  reduceCityList(jsonData)
  sortContentContainer.forEach((element, index) => {
    if (index) {
      element.addEventListener('mouseup', function () {
        reduceCityList(jsonData)
      })
    } else {
      element.addEventListener('mouseup', function () {
        sortedContinentArray = []
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
 * @param {object} continentCountArray - Array of numbers containing the count of each continents
 * @param {number} flag - to pass the origin of function call
 */
function sortByTemperature (jsonData, continentCountArray, flag) {
  if (flag === 1) {
    orderOfSortByTemperature = !orderOfSortByTemperature
  }
  const cityTemperatureMap = new Map()
  sortedCityArray = []
  for (const [city] of sortedMap.entries()) {
    if (city !== 'nil') { cityTemperatureMap.set(city, parseInt(jsonData[city].temperature)) }
  }
  let continentCount = 0
  let skipCity = 0
  for (let i = 0; i < continentCountArray.length; i++) {
    let iterator = 0
    let continentWiseMap = new Map()
    continentCount += continentCountArray[i]
    for (const [city] of cityTemperatureMap) {
      if (skipCity > iterator) {
        iterator++
        continue
      }
      if (iterator < continentCount) {
        continentWiseMap.set(city, parseInt(jsonData[city].temperature))
        if (orderOfSortByTemperature) {
          continentWiseMap = new Map([...continentWiseMap.entries()].sort((a, b) => a[1] - b[1]))
        } else {
          continentWiseMap = new Map([...continentWiseMap.entries()].sort((a, b) => b[1] - a[1]))
        }
      } else {
        break
      }
      iterator++
    }
    skipCity += continentCountArray[i]
    for (const [key] of continentWiseMap) {
      sortedCityArray.push(jsonData[key])
    }
  }
  if (orderOfSortByTemperature) {
    sortContentContainer[1].children[1].src = '../General_Images_&_Icons/arrowUp.svg'
  } else {
    sortContentContainer[1].children[1].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  orderOfSortByTemperature = !orderOfSortByTemperature
  createContinentCards(sortedCityArray)
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
  sortedContinentArray = Array.from(sortedMap.values())
  reduceCityList(jsonData, 1)
}

// Method to group cities with similar continents
/**
 *
 * @param {object} jsonData - Data loaded from json
 * @param {number} flag - to pass the origin of function call
 */
function reduceCityList (jsonData, flag) {
  let index = 0
  const continentCountArray = [1]
  sortedContinentArray.reduce((accumulator, currentValue) => {
    if (accumulator[0] === currentValue[0]) {
      continentCountArray[index] += 1
    } else {
      index += 1
      continentCountArray[index] = 1
    }
    return currentValue
  })
  sortByTemperature(jsonData, continentCountArray, flag)
}

// Method to call create cards for continent-wise display of cities
/**
 *
 * @param {object} citiesList - Array of sorted city names
 */
function createContinentCards (citiesList) {
  continentCityContainer.innerHTML = ''
  for (let i = 11; i >= 0; i--) {
    createContinentCard(citiesList[i])
  }
}
