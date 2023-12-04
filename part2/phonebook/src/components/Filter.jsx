const Filter = ({showName, handleShowNameChange}) => {
  return (
    <div>
      Filter shown with <input value={showName} onChange={handleShowNameChange}/>
    </div>
  )
}

export default Filter