import * as middleSection from './WeatherAppTask2.js'

const continentCityContainer = document.querySelector('.continent-city-container')
const sortIcons = document.querySelectorAll('.sort-icon')
let orderOfSortByTemperature = false
let orderOfSortByContinentName = false

// Method to create continent and city card
export function createContinentCard(jsonEntry) {
  console.log(jsonEntry);
  let continentName = jsonEntry.timeZone.split('/').slice(0, 1)
  const continentCard = `<div class="continent-city-self">
                        <p class="continent-name">${continentName}</p>
                        <p class="continent-temperature">${jsonEntry.temperature}</p>
                        <p class="continent-place-time">${jsonEntry.cityName}, ${middleSection.startTime(jsonEntry.timeZone)}</p>
                        <div class="continent-humidity-container">
                            <img src="../Weather_Icons/humidityIcon.svg" alt="Rain-Drop" class="continent-humidity-icon">
                            <p class="icon-value-card">${jsonEntry.humidity}</p>
                        </div>
                      </div>`
  continentCityContainer.insertAdjacentHTML('afterbegin', continentCard)
}

// Method to add event listeners for sorting options
export function sortOnClick(jsonData) {
  sortIcons.forEach((element, index) => {
    if (index) {
      element.addEventListener('click', function(){
        sortByTemperature(jsonData)
      })
    }
    else {
      element.addEventListener('click', function() {
        sortByContinentName(jsonData)
      })
    }
  })
}

// Method to sort by temperature
function sortByTemperature(jsonData) {
  let cityTemperatureMap = new Map()
  let sortedMap
  let sortedCityArray = []
  for (let city in jsonData) {
    cityTemperatureMap.set(city, parseInt(jsonData[city].temperature))
  }
  if (orderOfSortByTemperature) {
    console.log(orderOfSortByTemperature);
    sortedMap = new Map([...cityTemperatureMap.entries()].sort((a, b) => b[1] - a[1]))
    sortIcons[1].src = '../General_Images_&_Icons/arrowUp.svg'
  }
  else {
    console.log(orderOfSortByTemperature);
    sortedMap = new Map([...cityTemperatureMap.entries()].sort((a, b) => a[1] - b[1]))
    sortIcons[1].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  orderOfSortByTemperature = !orderOfSortByTemperature
  for (let [key] of sortedMap) {
    sortedCityArray.push(jsonData[key])
  }
  createContinentCards(sortedCityArray)
}

function sortByContinentName(jsonData) {
  let cityContinentMap = new Map()
  let sortedCityArray = []
  for (let city in jsonData) {
    cityContinentMap.set(city, jsonData[city].timeZone.split('/').slice(0, 1))
  }
  if (orderOfSortByContinentName) {
    cityContinentMap = new Map([...cityContinentMap.entries()].sort((a, b) => b[1] - a[1]))
    sortIcons[0].src = '../General_Images_&_Icons/arrowUp.svg'
  }
  else {
    cityContinentMap = new Map([...cityContinentMap.entries()].sort((a, b) => a[1] - b[1]))
    sortIcons[0].src = '../General_Images_&_Icons/arrowDown.svg'
  }
  orderOfSortByContinentName = !orderOfSortByContinentName
  for (let [key] of cityContinentMap) {
    sortedCityArray.push(jsonData[key])
  }
  console.log(sortedCityArray);
  createContinentCards(sortedCityArray)
}

function createContinentCards(citiesList) {
  continentCityContainer.innerHTML = ''
  for (let i = 11; i >= 0; i++) {
    createContinentCard(citiesList[i])
  }
}