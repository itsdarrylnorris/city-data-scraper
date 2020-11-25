export interface Country {
  name: string
  iso3: string
  iso2: string
  phone_code: string
  capital: string
  currency: string
  native: string
  region: string
  subregion: string
  emoji: string
  emojiU: string
  states: State[]
}

export interface State {
  id?: number
  name: string
  state_code: string
}
