const filterIcons = document.querySelectorAll('.icons');
const filterIconContainer = document.querySelectorAll('.icon-container');
const cardRack = document.querySelector('.cards-rack')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const spinner = document.querySelector('#counter-value')
const cardScrollerIcon = document.querySelectorAll('.card-scroller-icon')
let setIntervalFlag = 0;

// Method to return livetime for provided Timezone
export function startTime(val, cityTime, citySeconds) {
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
  if (cityTime !== undefined) {
    let liveTimeSeconds = liveTimeToDateObject.getSeconds();
    liveTimeSeconds = checkTime(liveTimeSeconds)
    citySeconds.innerHTML = ':' + liveTimeSeconds
    cityTime.innerHTML = liveTimeHour + ":" + liveTimeMinute
    if (ampm == "AM") {
      return 1
    }
    else {
      return 0
    }
  }
  let timeToString = liveTimeHour + ":" + liveTimeMinute + ' ' + ampm;
  return timeToString
}



export function swapDateParts(liveDate) {
  let temp = liveDate[0]
  liveDate[0] = liveDate[1]
  liveDate[1] = temp
  liveDate = liveDate.join('/')
  return liveDate
}

// Method to update Date for respective city
export function getDate(cityTimeZone, flag) {
  let liveDate = new Date().toLocaleDateString([], { timeZone: cityTimeZone });
  liveDate = liveDate.split('/')
  liveDate = swapDateParts(liveDate)
  let liveDateToDateObject = new Date(liveDate).toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let date = liveDateToDateObject.split(' ')
  if (flag === undefined) {
    date[1] = date[1].toUpperCase()
  }
  date = date.join( '-' )
  return date
}

// Method to update live time whenever a new card is created
function runTimeDateForCards(val,cityCardTime, cityCardDate) {
  cityCardTime.innerHTML = startTime(val);
  let t = setInterval(function () {
    if (setIntervalFlag == 1) {
      clearInterval(t)
    }
    if (!(startTime(val) === undefined)) {
      cityCardTime.innerHTML = startTime(val);
      cityCardDate.innerHTML = getDate(val);
    }
  }, 100)
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
  runTimeDateForCards(jsonCityEntry.timeZone, cityCardTime, cityCardDate)
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

// Method to add click listener and call filter function on icon click
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
      setIntervalFlag = 1
      setTimeout(() => {
        setIntervalFlag = 0
        filterOnClick(index, jsonData)
      }, "100")
    })
  })
}

// Method to filter cities based on given conditions for creating Cards
function filterOnClick(iconValue, jsonData) {
  let cityValueMap = new Map()
  let sortedMap
  let filteredCityArray = []
  switch (iconValue) {
    case 0:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].temperature))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnSunny)
      break
    case 1:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].precipitation))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnSnow)
      break
    case 2:
      for (let city in jsonData) {
        cityValueMap.set(city, parseInt(jsonData[city].humidity))
      }
      sortedMap = new Map([...cityValueMap.entries()].sort((a, b) => b[1] - a[1]));
      for(let [key] of sortedMap) {
        if ((parseInt(jsonData[key].temperature) < 20) && (parseInt(jsonData[key].humidity) >= 50)) {
          filteredCityArray.push(key)
        }
      }
      for(let [key] of sortedMap) {
        filteredCityArray.push(jsonData[key])
      }
      filteredCityArray = filteredCityArray.filter(filterOnCloudy)
      break
  }
  filteredCityArray.forEach( (element,index) => {
    filteredCityArray[index] = filteredCityArray[index].cityName.toLowerCase()
  })
  getSpinnerValue(filteredCityArray, jsonData)
}

// Filter method to filter for Sunny Weather
function filterOnSunny(cityPair) {
  return (parseInt(cityPair.temperature)) > 29
}

// Filter method to filter for Snowy Weather
function filterOnSnow(cityPair) {
  return (20 <= parseInt(cityPair.temperature) && parseInt(cityPair.temperature) < 29) && (parseInt(cityPair.humidity) > 50) && (parseInt(cityPair.precipitation) < 50)
}

// Filter method to filter for Cloudy Weather
function filterOnCloudy(cityPair) {
  return ((parseInt(cityPair.temperature) < 20) && (parseInt(cityPair.humidity) >= 50))
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

// Method to get current Spinner Value
function getSpinnerValue(citiesList, jsonData) {
  let spinnerValue = spinner.value
  spinner.addEventListener('change', (e) => {
    if (e.target.value < 3) {
      e.target.value = 3
    }
    else if (e.target.value > 10) {
      e.target.value = 10
    }
    spinnerValue = e.target.value
    adjustFilteredArray(citiesList, jsonData, spinnerValue)
  })
  adjustFilteredArray(citiesList, jsonData, spinnerValue)
}

// Method to call create card for filtered cities
function adjustFilteredArray(citiesList, jsonData, spinnerValue) {
  cardRack.innerHTML = ''
  citiesList.forEach((element, index) => {
    if (parseInt(spinnerValue) <= index) {
      return
    }
    else {
      createCard(jsonData[element]);
    }
  })
  changeCardRackStyle()
  scrollOnClick()
}

window.onresize = function () {
  changeCardRackStyle()
}

// Method to style Card Rack according to its width: 
function changeCardRackStyle() {
  let cardRackWidth = cardRack.scrollWidth - cardRack.clientWidth
  if (cardRackWidth <= 0) {
    cardScrollerIcon[0].style.display = 'none'
    cardScrollerIcon[1].style.display = 'none'
    cardRack.classList.add('flex-space-evenly')
    cardRack.classList.remove('flex-space-between')
  }
  else {
    cardScrollerIcon[0].style.display = 'block'
    cardScrollerIcon[1].style.display = 'block'
    cardRack.classList.add('flex-space-between')
    cardRack.classList.remove('flex-space-evenly')
  }
}

// Method to scroll the cards on clicking arrow icons
function scrollOnClick() {
  cardScrollerIcon.forEach((element, index) => {
    element.addEventListener('click', () => {
      let cardMargin = (getComputedStyle(cardRack.children[0]).marginLeft)
      let cardWidth = cardRack.children[0].getBoundingClientRect().width + 2 * parseInt(cardMargin)
      console.log(cardWidth);
      if(index){
        cardRack.scrollBy({
          left: cardWidth,
          behavior: "smooth"
        });
      }
      else {
        cardRack.scrollBy({
          left: -cardWidth,
          behavior: "smooth"
        });
      }
    })
  })
}