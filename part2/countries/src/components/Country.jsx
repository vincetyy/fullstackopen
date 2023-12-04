import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

const Country = ({country}) => {
  const [temp, setTemp] = useState('')
  const [wind, setWind] = useState('')
  const [icon, setIcon] = useState('')

  const api_key = import.meta.env.VITE_SOME_KEY
  let lat = country.capitalInfo.latlng[0]
  let lng = country.capitalInfo.latlng[1]

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`)
      .then(response => {
        setTemp((response.data.main.temp - 273.15).toFixed(2))
        setWind(response.data.wind.speed)
        setIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
    })
  }, [])



  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        Captial: {country.capital} <br></br>
        Area: {country.area}
      </p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} />
      
      <h2>Weather in {country.capital}</h2>

      <p>Temperature: {temp} Celcius</p>
      <img src={icon}/>
      <p>Wind: {wind} m/s</p>
    </div>
  )
}

export default Country