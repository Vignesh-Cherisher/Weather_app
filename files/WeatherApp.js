let cityImage = document.querySelector('#city-image').children[0]
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')
let cityValue = document.querySelector('#cities')
let cityInput = document.getElementsByClassName('drop-down')[0];

/**
 *
 */
( async () => {
  const response = await fetch('./data.json')
  const jsonData = await response.json()
  datalistPopulate(jsonData)
  citySelect(jsonData)
})()

function datalistPopulate(jsonData) { 
  for(let city in jsonData) {
    let option = document.createElement('option')
    console.log(city)
    option.value = jsonData[city].cityName
    cityValue.appendChild(option)
  }
}

function citySelect(jsonData){
  cityInput.addEventListener("input", function(event){
    let val = cityInput.value.toLowerCase()
    changeCityImg(jsonData[val])
    getCityTime(jsonData[val])
  })
  cityInput.addEventListener("click", () => {
    cityInput.click();
  })
}

function changeCityImg(cityName) {
  if(cityName == "nil")
    cityImage.src = '../Icons_for_cities/placeholder.png'
  else {
    let cityImgSource = cityName.url
    cityImage.src = '../Icons_for_cities/' + cityImgSource
  }
}

function getCityTime(cityTime) {
  
}

/**
 * Method to scroll Middle section both Horizontally and Vertically
 * @param {object} target - target element
 * @param {object} targetContainer - underlying container
 */
function yScroll (target, targetContainer) {
  target.addEventListener('wheel', (evt) => {
    console.log(typeof (target), typeof (targetContainer))
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

for (let i = 0; i < scrollable.length; i++) {
  yScroll(scrollable[i], scrollRack)
}

yScroll(scrollOverlay[0], scrollRack)
