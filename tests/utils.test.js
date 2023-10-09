import * as unitFunctions from '../files/utils';

// Check if the value is converted to fahrenheit appropriately
test('convert celsius to fahrenheit', () => {
  const celsiusValues = { '-1': '30 F', 10: '50 F', 32: '90 F', 0: '32 F', '-10': '14 F', '-100': '-148 F' }
  for (let celsius in celsiusValues) {
    expect(unitFunctions.celsiusToFahrenheit(celsius)).toEqual(celsiusValues[celsius]); // -46.
  }
});

// Check if Date format is changed on given conditions
test('swap Date from mm/dd/yyyy to dd/mm/yyyy', () => {
  const dates = { '4/12/2023':["12", "4", "2023"] , '31/1/1995':["1", "31", "1995"], '15/7/1769':["7", "15", "1769"], '0':["14", "2035"], '0/0/1999':["0", "0", "1999"]}
  for (let correctFormat in dates) {
    expect(unitFunctions.swapDateParts(dates[correctFormat])).toEqual(correctFormat);
  }
});

// Check if 0 is appended ot returned value at correct conditions
test('append "0" if the time comprises of a single digit.', () => {
  const hours = { 1: '01', 10: '10', 100: '100', 0: '00', 9: '09' }
  for (let hourElement in hours) {
    expect(unitFunctions.addZeroToSingleDigitTime(hourElement)).toBe(hours[hourElement]);
  }
})

// Check for Sunny filter function to return true on contradicting conditions
test('filter function to detect Sunny Weather that returns true', () => {
  const cityTemperaturePairs = {
    'Tokyo': { temperature: '43°C' },
    'SanAndreas': { temperature: '52°C' },
    'Canberra': { temperature: '29°C' }
  }
  for (let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnSunny( cityTemperaturePairs[city])).toBeTruthy();
  }
})

// Check for Sunny filter function to return false on contradicting conditions
test('filter function to detect Sunny Weather that returns false', () => {
  const cityTemperaturePairs = {
    'Delhi': { temperature: '28°C', },
    'Moscow': { temperature: '-5°C' },
    'Chicago': { temperature: '10°C' }
  }
  for(let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnSunny(cityTemperaturePairs[city])).toBeFalsy();
  } 
})

// Check for Snow filter function to return true on contradicting conditions
test('Filter function to detect Snow Weather that returns true', () => {
  const cityTemperaturePairs = {
    'Kabul': { temperature: '22°C', humidity: '89%', precipitation: '10%'},
    'Moscow': { temperature: '27°C', humidity: '96%', precipitation: '45%' },
    'Chicago': { temperature: '20°C', humidity: '51%', precipitation: '49%' }
  }
  for (let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnSnow(cityTemperaturePairs[city])).toBeTruthy();
  } 
})

// Check for Snow filter function to return false on contradicting conditions
test('Filter function to detect Snow Weather that returns false', () => {
  const cityTemperaturePairs = {
    'Kabul': { temperature: '49°C', humidity: '89%', precipitation: '10%'},
    'Moscow': { temperature: '27°C', humidity: '50%', precipitation: '50%' },
    'Chicago': { temperature: '29°C', humidity: '51%', precipitation: '49%' }
  }
  for(let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnSnow(cityTemperaturePairs[city])).toBeFalsy();
  } 
})

// Check for Rainy filter function to return true on contradicting conditions
test('Filter function to detect Rainy Weather that returns true', () => {
  const cityTemperaturePairs = {
    'Kabul': { temperature: '19°C', humidity: '89%' },
    'Moscow': { temperature: '-15°C', humidity: '50%' },
    'Chicago': { temperature: '-100°C', humidity: '51%' }
  }
  for(let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnRainy(cityTemperaturePairs[city])).toBeTruthy();
  } 
})

// Check for Rainy filter function to return false on contradicting conditions
test('Filter function to detect Rain Weather that returns false', () => {
  const cityTemperaturePairs = {
    'Kabul': { temperature: '20°C', humidity: '89%' },
    'Moscow': { temperature: '25°C', humidity: '50%' },
    'Chicago': { temperature: '9°C', humidity: '49%' }
  }
  for(let city in cityTemperaturePairs) {
    expect(unitFunctions.filterOnRainy(cityTemperaturePairs[city])).toBeFalsy();
  } 
})