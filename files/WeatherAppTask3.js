import * as middleSection from './WeatherAppTask2.js'

const continentCityContainer = document.querySelector('.continent-city-container')
const sortIcons = document.getElementsByClassName('sort-icon')

// Method to create continent and city card
export function createContinentCard(jsonEntry) {
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
  for (let i = 0; i < 12; i++)
    continentCityContainer.insertAdjacentHTML('afterbegin', continentCard)
}

// Method to add event listeners for sorting options
function sortOnClick() {
  sortIcons.forEach(element => {
    element.addEventListener('click', )    
  });
}