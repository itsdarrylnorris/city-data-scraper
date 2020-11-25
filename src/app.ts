import cheerio from 'cheerio'
import 'isomorphic-fetch'

interface StateInterface {
  state: string
  stateUrl: string
  cities?: CityInterface[]
}

interface CityInterface {
  city: string | Element
  cityUrl: string
}

/**
 * CityDataScrapper
 *
 * @url http://www.city-data.com/
 */
export class CityDataScrapper {
  async getStatesAndCities(): Promise<StateInterface[]> {
    let states = await this.getStatesWithUrls()
    return await this.getCitiesFromUrl(states)
  }

  /**
   * Get States
   */
  async getStatesWithUrls(): Promise<StateInterface[]> {
    let rawDataResponse = await fetch('http://www.city-data.com/')
    let rawData = await rawDataResponse.text()
    const $ = cheerio.load(rawData)
    let states: StateInterface[] = []

    // @ts-ignore
    $('#home1 ul.tab-list-long a').each((index: number, element: cheerio.Element) => {
      let $element = cheerio.load(element)
      states.push({ state: $element('a').html() || '', stateUrl: $element('a').attr('href') || '' })
    })

    return states
  }

  /**
   * Get cities
   * @param states
   */
  async getCitiesFromUrl(states: StateInterface[]): Promise<StateInterface[]> {
    for (let i = 0; i < states.length; i++) {
      let state = states[i]

      if (state.state.includes('Small')) continue

      let urlStateRawData = await fetch(state.stateUrl)
      let urlState = await urlStateRawData.text()
      const $urlState = cheerio.load(urlState)
      let cities: CityInterface[] = []

      // @ts-ignore
      $urlState('table#cityTAB tbody tr').each((cityIndex: number, cityName: cheerio.Element) => {
        let $elementCity = cheerio.load(cityName)
        let city: string | Element = $elementCity('td').eq(1).text().toString() || ''
        if (city.includes(',')) {
          city = city.split(',')[0]
        }
        cities.push({
          city,
          cityUrl: `http://www.city-data.com/city/${city.replace("'", '').replace(' ', '-')}-${state.state}.html`,
        })
      })

      states[i].cities = cities
    }

    return states
  }
}
