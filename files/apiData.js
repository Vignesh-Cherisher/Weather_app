/**
 *
 * @returns {object} - Data of all cities and their values
 */
export async function fetchCityTime () {
  const fetchData = await fetch('https://soliton.glitch.me/all-timezone-cities')
    .then((response) => { return response.json() })
  return changeKeyValues(fetchData)
}

/**
 *
 * @returns {object} - Key-value pairs of all city objects with city name as key value
 * @param {object} fetchData - Key-value pairs with numbers as key value
 */
export function changeKeyValues (fetchData) {
  for (const iterator in fetchData) {
    const keyValue = fetchData[iterator].cityName.toLowerCase()
    const value = fetchData[iterator]
    delete fetchData[iterator]
    fetchData[keyValue] = value
  }
  return fetchData
}

/**
 *
 * @returns {object} - Array of celsius values for next five hour data
 * @param {string} cityDateAndTime - Date and time of city passed
 * @param {string} cityName - Name of city passed
 */
export async function fetchNextFiveHours (cityDateAndTime, cityName) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const fetchBody = {
    city_Date_Time_Name: cityDateAndTime + ', ' + cityName,
    hours: 6
  }

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(fetchBody),
    redirect: 'follow'
  }

  const fetchData = await fetch('/hourly-forecast', requestOptions)
    .then((response) => { return response.json() })
    .catch(error => console.log('error', error))
  console.log(fetchData);
  return (fetchData.temperature)
}
