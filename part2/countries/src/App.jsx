import CountryForm from "./components/CountryForm"
import CountriesList from "./components/CountriesList"
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        setFilteredCountries(response.data)
      })
  }, [])


  const handleCountryChange = (event) => {
    setCountry(event.target.value)
    setFilteredCountries(countries.filter(c => c.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }
  

  return (
    <div>
      <CountryForm country={country} handleCountryChange={handleCountryChange} />
      <CountriesList filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} />
    </div>
  )
}

export default App