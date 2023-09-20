import * as middleSection from './WeatherAppTask2.js'

const continentCityContainer = document.querySelector('.continent-city-container')
const sortIcons = document.querySelectorAll('.sort-icon')
let orderOfSortByTemperature = true
let orderOfSortByContinentName = true
let sortedContinentArray = []
let sortedMap
let setIntervalFlag = 0

// Method to create continent and city card
export function createContinentCard(jsonEntry) {
  let continentName = jsonEntry.timeZone.split('/').slice(0, 1)
  const continentCard = `<div class="continent-city-self">
                        <p class="continent-name">${continentName}</p>
                        <p class="continent-temperature">${jsonEntry.temperature}</p>
                        <p class="continent-place-time">${jsonEntry.cityName}, <span class="continent-time">${middleSection.startTime(jsonEntry.timeZone)}</span></p>
                        <div class="continent-humidity-container">
                            <img src="../Weather_Icons/humidityIcon.svg" alt="Rain-Drop" class="continent-humidity-icon">
                            <p class="icon-value-card">${jsonEntry.humidity}</p>
                        </div>
                      </div>`
  continentCityContainer.insertAdjacentHTML('afterbegin', continentCard)
}

// Method to add event listeners for sorting options
export function sortOnClick(jsonData) {
  sortByContinentName(jsonData)
  reduceCityList(jsonData)
  sortIcons.forEach((element, index) => {
    if (index) {
      element.addEventListener('mouseup', function () {
        setIntervalFlag = 1
        setTimeout(() => {
          setIntervalFlag = 0
          reduceCityList(jsonData)
        }, '200')
      })
    }
    else {
      element.addEventListener('mouseup', function () {
        sortedContinentArray = []
        sortedMap = new Map()
        sortByContinentName(jsonData)
      })
    }
  })
}

// Method to sort cards by temperature
function sortByTemperature(jsonData, continentCountArray) {
  let cityTemperatureMap = new Map()
  let sortedCityArray = []
  for (let [city] of sortedMap.entries()) {
    if (city != "nil") { cityTemperatureMap.set(city, parseInt(jsonData[city].temperature)) }
  }
  
  let continentCount = 0
  let skipCity = 0
  for (let i = 0; i < continentCountArray.length; i++) {
    let iterator = 0
    let continentWiseMap = new Map()
    continentCount += continentCountArray[i]
    for (let [city] of cityTemperatureMap) {
      if (skipCity > iterator) {
        iterator++
        continue
      }
      if (iterator < continentCount) {
        continentWiseMap.set(city, parseInt(jsonData[city].temperature))
        if (orderOfSortByTemperature) {
          continentWiseMap = new Map([...continentWiseMap.entries()].sort((a, b) => b[1] - a[1]))
        }
        else {
          continentWiseMap = new Map([...continentWiseMap.entries()].sort((a, b) => a[1] - b[1]))
        }        
      }
      else {
        break
      }
      iterator ++
    }
    skipCity += continentCountArray[i]
    for (let [key] of continentWiseMap) {
      sortedCityArray.push(jsonData[key])
    }
  }
  if (orderOfSortByTemperature) {
    sortIcons[1].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  else {
    sortIcons[1].src = '../General_Images_&_Icons/arrowUp.svg'
  }
  orderOfSortByTemperature = !orderOfSortByTemperature
  createContinentCards(sortedCityArray)
}

// Method to sort cards by continent Name
function sortByContinentName(jsonData) {
  let cityContinentMap = new Map()
  let sortedCityArray = []
  for (let city in jsonData) {
    if (city != "nil") { cityContinentMap.set(city, jsonData[city].timeZone.split('/').slice(0, 1)) }
  }
  if (orderOfSortByContinentName) {
    sortedMap = new Map([...cityContinentMap.entries()].sort((a, b) => {
      return (a[1] > b[1]) ? 1 : -1
    }))
    sortIcons[0].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  else {
    sortedMap = new Map([...cityContinentMap.entries()].sort((a, b) => (a[1]> b[1]) ? -1: 1))
    sortIcons[0].src = '../General_Images_&_Icons/arrowUp.svg'
  }
  orderOfSortByContinentName = !orderOfSortByContinentName
  for (let [key] of sortedMap) {
    sortedCityArray.push(jsonData[key])
  }
  sortedContinentArray = Array.from(sortedMap.values())
  createContinentCards(sortedCityArray)
}

// Method to group cities with similar continents
function reduceCityList(jsonData) {
  let index = 0
  let continentCountArray = [1]
  sortedContinentArray.reduce((accumulator, currentValue) => {
    if (accumulator[0] == currentValue[0]) {
      continentCountArray[index] += 1
    }
    else {
      index += 1
      continentCountArray[index] = 1
    }
    return currentValue
  })
  sortByTemperature(jsonData, continentCountArray)
}

// Method to call create cards for continent-wise display of cities
function createContinentCards(citiesList) {
  continentCityContainer.innerHTML = ''
  for (let i = 11; i >= 0; i--) {
    createContinentCard(citiesList[i])
  }
  startContinentTime(citiesList)
}

function startContinentTime(citiesList) {
  let continentTime = document.querySelectorAll('.continent-time')
  const continentInterval = setInterval(function () {
    if (setIntervalFlag === 1) {
      clearInterval(continentInterval)
    }
    for (let i = 0; i < 12; i++) {
      let continentTimeZone = citiesList[i].timeZone
      if (!(middleSection.startTime(continentTimeZone) === undefined)) {
        continentTime[i].innerHTML = middleSection.startTime(continentTimeZone)
      }
    }
  }, 100)
}