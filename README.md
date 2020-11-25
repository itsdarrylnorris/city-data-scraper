### City-Data.com Scrapper

Scrappes USA States and Cities names from City-Data.com

Example

```javascript

async function main() {
  let scrapper = new CityDataScrapper()
  let statesAndcities = await scrapper.getStatesAndCities()
  console.log(JSON.stringify(statesAndcities))
}

main()
```
