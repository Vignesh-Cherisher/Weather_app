// Method to convert ceksius to fahrenheit
/**
 * @returns {string} - fahrenheit value of a city
 * @param {object} celsius - Celsius value of a city
 */
export function celsiusToFahrenheit (celsius) {
  return (parseInt(celsius) * 9 / 5 + 32).toFixed(0) + ' F' // round to two decimal places.
}

// Method to interchange date from MM/DD/YYYY format to DD/MM/YYYY format
/**
 * @returns {string} - live Date of a city object
 * @param {object} liveDate - Array of strings consisting live date of a city object
 */
export function swapDateParts (liveDate) {
  if (liveDate.length === 3) {
    const temp = liveDate[0]
    liveDate[0] = liveDate[1]
    liveDate[1] = temp
    liveDate = liveDate.join('/')
    return liveDate
  }
  return '0'
}

// Method to append '0' if the time comprises of a single digit.
/**
 *
 * @returns {string} - passed string appended with '0' if needed
 * @param {number} i - to pass live time as string
 */
export function addZeroToSingleDigitTime (i) {
  if (i < 10) { i = '0' + i }
  return i
}

// Filter method to filter for Sunny Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
export function filterOnSunny (cityPair) {
  return (parseInt(cityPair.temperature)) >= 29
}

// Filter method to filter for Snowy Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
export function filterOnSnow (cityPair) {
  return (parseInt(cityPair.temperature) >= 20 && parseInt(cityPair.temperature) < 29) && (parseInt(cityPair.humidity) > 50) && (parseInt(cityPair.precipitation) < 50)
}

// Filter method to filter for Rainy Weather
/**
 *
 * @returns {boolean} - truthy value for filter function
 * @param {object} cityPair - Specific City's key value pairs
 */
export function filterOnRainy (cityPair) {
  return ((parseInt(cityPair.temperature) < 20) && (parseInt(cityPair.humidity) >= 50))
}
