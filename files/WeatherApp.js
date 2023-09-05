let cityImage = document.querySelector('#city-image').children[0]
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')
let cityValue = document.querySelector('#cities')
let cityInput = document.getElementsByClassName('drop-down')[0]
let cityDate = document.querySelector('#date')
let cityTime = document.querySelector('.time').children[0]
let citySeconds = document.querySelector('#seconds')
;

//Asynchronous Function to load json Data
/**
 *
 */
( async () => {
  const response = await fetch('./data.json')
  const jsonData = await response.json()
  datalistPopulate(jsonData)
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
    updateCityDateTime(jsonData[val])
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
function updateCityDateTime(jsonCityName) {
  let jsonDateTime = jsonCityName.dateAndTime
  jsonDateTime = jsonDateTime.split(' ')
  let jsonTime = jsonDateTime[1]
  let jsonDate = jsonDateTime[0].slice(0,-1)
  updateCityTime(jsonTime)
  updateCityDate(jsonDate)
}

//Method to update City Time
function updateCityTime(jsonTime){
  if(isNaN(parseInt(jsonTime))){
    cityTime.innerHTML = jsonTime
    citySeconds.innerHTML = ''
  }
  else {
    cityTime.innerHTML = jsonTime.slice(0, -3)
    citySeconds.innerHTML = jsonTime.slice(-3)
  }
  runCityTime(jsonTime)
}

//Method to run Live Time of selected City
function runCityTime(jsonTime){
  jsonTime = jsonTime.split(':')
  let liveTime = setTimeout(function(){ currentTime() }, 1000);
  updatedCityTime(liveTime)
}

//Method to update City date
function updateCityDate(jsonDate) {

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
