export type GeolocationData = {
  as: string
  city: string
  country: string
  countryCode: string
  isp: string
  lat: number
  lon: number
  org: string
  query: string
  region: string
  regionName: string
  status: string
  timezone: string
  zip: string
}

export type WeatherDayData = {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    },
  ]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export type WeatherForecastDayData = {
  clouds: { all: number }
  dt: number
  dt_txt: string
  main: {
    feels_like: number
    grnd_level: number
    humidity: number
    pressure: number
    sea_level: number
    temp: number
    temp_kf: number
    temp_max: number
    temp_min: number
  }
  visibility: number
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    },
  ]
  wind: { speed: 2.96; deg: 2; gust: 3.94 }
}

export type WeatherForecastData = {
  city: {
    coord: { lat: number; lon: number }
    country: string
    id: number
    name: string
    population: number
    sunrise: number
    sunset: number
    timezone: number
  }
  cnt: number
  cod: string
  list: WeatherForecastDayData[]
}
