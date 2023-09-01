let cityImage = document.querySelector('#city-image').firstChild
const scrollable = document.getElementsByClassName('card-self')
const scrollOverlay = document.getElementsByClassName('card-overlay')
const scrollRack = document.querySelector('.cards-rack')

/**
 * @returns {object} - json file data
 */
async function fetchJson () {
  const jsonData = await fetch('./data.json').then((res) => {return res.json()})
}

fetchJson()

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
