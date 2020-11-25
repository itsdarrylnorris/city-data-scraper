"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
require("isomorphic-fetch");
class CityDataScrapper {
    getStatesAndCities() {
        return __awaiter(this, void 0, void 0, function* () {
            let states = yield this.getStatesWithUrls();
            return yield this.getCitiesFromUrl(states);
        });
    }
    getStatesWithUrls() {
        return __awaiter(this, void 0, void 0, function* () {
            let rawDataResponse = yield fetch('http://www.city-data.com/');
            let rawData = yield rawDataResponse.text();
            const $ = cheerio_1.default.load(rawData);
            let states = [];
            $('#home1 ul.tab-list-long a').each((index, element) => {
                let $element = cheerio_1.default.load(element);
                states.push({ state: $element('a').html() || '', stateUrl: $element('a').attr('href') || '' });
            });
            console.log({ states });
            return states;
        });
    }
    getCitiesFromUrl(states) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < states.length; i++) {
                let state = states[i];
                if (state.state.includes('Small'))
                    continue;
                let urlStateRawData = yield fetch(state.stateUrl);
                let urlState = yield urlStateRawData.text();
                const $urlState = cheerio_1.default.load(urlState);
                let cities = [];
                $urlState('table#cityTAB tbody tr').each((cityIndex, cityName) => {
                    let $elementCity = cheerio_1.default.load(cityName);
                    let city = $elementCity('td').eq(1).text().toString() || '';
                    if (city.includes(',')) {
                        city = city.split(',')[0];
                    }
                    cities.push({
                        city,
                        cityUrl: `http://www.city-data.com/city/${city.replace("'", '').replace(' ', '-')}-${state.state}.html`,
                    });
                });
                states[i].cities = cities;
            }
            return states;
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let scrapper = new CityDataScrapper();
        let statesAndcities = yield scrapper.getStatesAndCities();
        console.log(JSON.stringify(statesAndcities));
    });
}
main();
//# sourceMappingURL=app.js.map