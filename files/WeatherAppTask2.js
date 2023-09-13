export const filterIcons = document.querySelectorAll('.icons');
export const filterIconContainer = document.querySelectorAll('.icon-container');
export const cardContainer = document.querySelector('.cards-rack');
export const cardRack = document.querySelector('.cards-rack')
const scrollOverlay = document.getElementsByClassName('card-overlay')


// Method to return livetime for provided Timezone
export function startTime(val) {
  let liveTime = new Date().toLocaleString([], { timeZone: val });
  liveTime = liveTime.split('/')
  liveTime = swapDateParts(liveTime)
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

// Method to update live time whenever a new card is created
export function runTimeForCards(val,cityCardTime) {
  cityCardTime.innerHTML = startTime(val);
  let t = setInterval(function () {
    if (!(startTime(val) === undefined)) {
      cityCardTime.innerHTML = startTime(val);
    }
  }, 1000)
}

export function swapDateParts(liveDate) {
  let temp = liveDate[0]
  liveDate[0] = liveDate[1]
  liveDate[1] = temp
  liveDate = liveDate.join('/')
  return liveDate
}

// Method to update Date for respective city
export function getDate(val) {
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
  date = date.join( '-' )
  return date
}

// Method to update Date for selected card
export function getDateForCards(val, cityCardDate) {
  cityCardDate.innerHTML = getDate(val);
  let t = setInterval(function () {
    cityCardDate.innerHTML = getDate(val);
  }, 10000)
}

// Method to create a card to display city details.
export function createCard(jsonCityEntry) {
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
  yScroll(card,cardRack)
}

// Method to add click listener and call filter export function on icon click
export function addFilterIconsListener(jsonData) {
  filterIcons.forEach( (element,index) => {
    element.addEventListener('click', () => {
      for (let i = 0; i < 3; i++){
        if (i === index) {
          filterIcons[i].classList.add('active-filter-icon')
        }
        else {
          filterIcons[i].classList.remove('active-filter-icon')
        }
      }
      filterOnClick(index, jsonData)
    })
  })
}

// Method to filter cities based on given conditions for creating Cards
export function filterOnClick(iconValue, jsonData) {
  let cityValueMap = new Map()
  let sortedMap
  let filteredCityArray = []
  switch (iconValue) {
    case 0:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].temperature))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key,value] of sortedMap) {
        if (sortedMap.get(key) > 29) {
          filteredCityArray.push(key)
        }
        else { break }
      }
      break
    case 1:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].precipitation))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key,value] of sortedMap) {
        if ((20 <= parseInt(jsonData[key].temperature) && parseInt(jsonData[key].temperature) < 29) && (parseInt(jsonData[key].humidity) > 50) && (parseInt(jsonData[key].precipitation) < 50)) {
          filteredCityArray.push(key)
        }
      }
      break
    case 2:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].humidity))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key,value] of sortedMap) {
        if ((parseInt(jsonData[key].temperature) < 20) && (parseInt(jsonData[key].humidity) >= 50)) {
          filteredCityArray.push(key)
        }
      }
      break
  }
  callCreateCard(filteredCityArray, jsonData)
}

// Method to call create card for filtered cities
export function callCreateCard(citiesList, jsonData) {
  cardContainer.innerHTML = ''
  cardContainer.setAttribute('style','padding-left: 40px;')
  citiesList.forEach(element => {
    createCard(jsonData[element]);
  })
}

// Method to set sunny icon as default icon and filter the cards based on it
export function makeSunnyFilterIconDefault() {
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