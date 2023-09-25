import fs from 'fs'
import * as jesto from 'jest-mock';
import {jest, expect, test} from '@jest/globals' 
import * as path from 'path';
import { fileURLToPath } from 'url';

const MOCK_DATA = {
  "nome": {
    "url": "nome.svg",
      "cityName": "Nome",
        "dateAndTime": "3/31/2020, 9:21:46 PM",
          "timeZone": "America/Nome",
            "temperature": "4°C",
              "humidity": "91%",
                "precipitation": "8%",
                  "nextFiveHrs": [
                    "6°C",
                    "7°C",
                    "11°C",
                    "2°C",
                    "10°C"
                  ]
  }
}

global.fetch = jesto.fn(() => Promise.resolve({
    json: () => Promise.resolve(MOCK_DATA)
}));

jest.mock('../data.json', ()=>({
  setting: MOCK_DATA
}), { virtual: true })

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
window.document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../index.html'));

const swapDateParts = import('../WeatherAppTask1.js');

test('swap Date from mm/dd/yyyy to dd/mm/yyyy', () => {
  expect(swapDateParts(["12","4","2023"])).toEqual('4/12/2023');
});