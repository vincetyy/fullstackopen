const CountryForm = ({country, handleCountryChange}) => {
  
  return (
  <div>
    Find Countries: <input value={country} onChange={handleCountryChange}/>
  </div>
  )
}

export default CountryForm