import Country from "./Country"


const showCountry = ({country, setFilteredCountries}) => {
  setFilteredCountries([country])
}

const CountryItem = ({country, setFilteredCountries}) => {
  return (
    <p>
      {country.name.common} <button onClick={() => showCountry({country, setFilteredCountries})}>Show</button>
    </p>
  )
}

const CountriesList = ({filteredCountries, setFilteredCountries}) => {

  if (filteredCountries.length === 0) {
    return (
      <p>Loading...</p>
    )
  }

  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (filteredCountries.length === 0) {
    return (
      <p>No match, specify another filter</p>
    )
  }

  if (filteredCountries.length === 1) {
    return (
      <Country country={filteredCountries[0]} />
    )
  }

  return (
    filteredCountries.map(c => 
      <CountryItem key={c.name.common} 
        country={c} 
        setFilteredCountries={setFilteredCountries} 
      />
    )
  )
}
  
export default CountriesList
