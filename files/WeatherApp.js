let cityImage = document.querySelector('#city-image').children[0]
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')
let cityValue = document.querySelector('#cities')
let cityInput = document.getElementsByClassName('drop-down')[0]
let cityDate = document.querySelector('#date')
let cityTime = document.querySelector('.time').children[0]
let citySeconds = document.querySelector('#seconds')
let cityAmPm = document.querySelector('#am-pm')
let toggleAmPm = 0
;

//Asynchronous Function to load json Data
/**
 *
 */
( async () => {
  const response = await fetch('./data.json')
  const jsonData = await response.json()
  datalistPopulate(jsonData)
  changeCityImg(jsonData.nil)
  changeCityDateTime(jsonData.nil)
  citySelect(jsonData)
})()

//Method to add option values from json to Datalist
function datalistPopulate(jsonData) { 
  for(let city in jsonData) {
    let option = document.createElement('option')
    option.value = jsonData[city].cityName
    cityValue.appendChild(option)
  }
}

//Method to call Functions for updating values whenever City name is changed
function citySelect(jsonData){
  cityInput.addEventListener("input", function(event){
    let val = cityInput.value.toLowerCase()
    changeCityImg(jsonData[val])
    changeCityDateTime(jsonData[val])
  })
}

//Changing City Image dynamically in top section
function changeCityImg(jsonCityName) {
  if(jsonCityName == "nil")
    cityImage.src = '../Icons_for_cities/placeholder.png'
  else {
    let cityImgSource = jsonCityName.url
    cityImage.src = '../Icons_for_cities/' + cityImgSource
  }
}

//Method to get and parse time and Date of selected cities
function changeCityDateTime(jsonCityName) {
  let jsonDateTime = jsonCityName.dateAndTime
  jsonDateTime = jsonDateTime.split(' ')
  let jsonTime = jsonDateTime[1]
  let jsonDate = jsonDateTime[0].slice(0,-1)
  if(jsonDateTime[2] == "AM")
    toggleAmPm = 0
  else
    toggleAmPm = 1
  if(jsonCityName.cityName == "NIL"){
    changeAmState(NaN)
    console.log("success")
  }
  else
    changeAmState(toggleAmPm)
  changeCityTime(jsonTime, jsonCityName.cityName)
  changeCityDate(jsonDate)
}

//Method to call functions to change City Time
function changeCityTime(jsonTime, cityName){
  if(isNaN(parseInt(jsonTime))){
    cityTime.innerHTML = jsonTime
    citySeconds.innerHTML = ''
  }
  else {
    updateCityTime(jsonTime)
    runCityTime(jsonTime, cityName)
  }
}

//Method to update city time
function updateCityTime(liveTime){
  cityTime.innerHTML = liveTime.slice(0, -3)
  citySeconds.innerHTML = liveTime.slice(-3)
}

//Method to run Live Time of selected City
function runCityTime(liveTime, cityName){
  liveTime = liveTime.split(':')
  liveTime.forEach((element,index) => {
    liveTime[index] = parseInt(element)
  });
  const interval = setInterval(function(){ 
    if( (cityName != cityInput.value) && (cityName != cityInput.placeholder)) {
      cityName = cityInput.value
      clearInterval(interval);
    }
    else
      updateCityTime(incrementSecond(liveTime));
  }, 1000);
}

//Method to increment Second
function incrementSecond(liveTime) {
  if(liveTime[2] >= 59) {
    incrementMinute(liveTime)
    liveTime[2] = 0
  }
  else 
    liveTime[2]++
  liveTime.forEach((element,index) => {
    liveTime[index] = element.toString()
    if(liveTime[index].length < 2 && index != 0){
      console.log(liveTime[index]);
      liveTime[index] = '0' + element
    }
  });
  liveTime = liveTime.join(':')
  return liveTime
}

//Method to increment Minute
function incrementMinute(liveTime) {
  if(liveTime[1] >= 59) {
    incrementHour(liveTime)
    liveTime[1] = 0
  }
  else 
    liveTime[1]++
  return liveTime
}

//Method to increment Hour
function incrementHour(liveTime) {
  if(liveTime[0] >= 12) {
    changeAmState(!toggleAmPm)
    liveTime[0] = 1
  }
  else 
    liveTime[0]++
  return liveTime
}

//Method to set AM or PM icon for city
function changeAmState(toggleAmPm) {
  if(isNaN(toggleAmPm)) {
    cityAmPm.src = "../General_Images_&_Icons/ampmState.jpeg"
    cityAmPm.classList.remove('am-pm')
    cityAmPm.classList.add('am-pm-nil')
    cityTime.style.color = "#fff"
    citySeconds.style.color = "#fff"
  }
  else if(!toggleAmPm){
    cityAmPm.src =  "../General_Images_&_Icons/amState.svg"
    cityTime.style.color = "#ffe5b4";
    citySeconds.style.color = "#ffe5b4";
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    toggleAmPm = !toggleAmPm
  }
  else {
    cityAmPm.src = "../General_Images_&_Icons/pmState.svg"
    cityTime.style.color = "#1E90FF"
    citySeconds.style.color = "#1E90FF"
    cityAmPm.classList.add('am-pm')
    cityAmPm.classList.remove('am-pm-nil')
    toggleAmPm = !toggleAmPm
  }
}

//Method to update City date
function changeCityDate(jsonDate) {

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

//Method to blur and handle click event in Input tag for selecting city.
function keepDatalistOptions(selector = '') {
  // select all input fields by datalist attribute or by class/id
  let datalistInputs = document.querySelectorAll(selector);
  if (datalistInputs.length) {
    for (let i = 0; i < datalistInputs.length; i++) {
      let input = datalistInputs[i];
      input.addEventListener("input", function(e) {
        e.target.setAttribute("placeholder", e.target.value);
        e.target.blur();
      });
      input.addEventListener("focus", function(e) {
        e.target.setAttribute("placeholder", e.target.value);
        e.target.value = "";
      });
      input.addEventListener("blur", function(e) {
        e.target.value = e.target.getAttribute("placeholder");
      });
    }
  }
}

keepDatalistOptions('.drop-down')

for (let i = 0; i < scrollable.length; i++) {
  yScroll(scrollable[i], scrollRack)
}

yScroll(scrollOverlay[0], scrollRack)
