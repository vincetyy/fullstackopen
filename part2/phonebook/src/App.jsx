import './index.css'
import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'


const App = () => {
  const [persons, setPersons] = useState([])
  
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showName, setShowName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleShowNameChange = (event) => {
    setShowName(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    if (newName === ''){
      alert(`Please input a name`)
      return
    }
    if (newNumber === ''){
      alert(`Please input a number`)
      return
    }

    const checkPerson = persons.find(person => person.name === newName)
    if(checkPerson) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber
        }
        personService
          .update(checkPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== checkPerson.id ? p : returnedPerson))
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${checkPerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== checkPerson.id))
        })
      }
      return
    }
    if(persons.find(person =>person.number === newNumber)) {
      alert(`Number ${newNumber} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(returnedPerson =>{
        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `${personObject.name} added`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(id)
      .then(
        setPersons(persons.filter(p => p.id !== id))
      )
    }
    
  }

  const personsToShow = showName  === '' ? 
      persons : persons.filter(person => person.name.toLowerCase().includes(showName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>
      <Filter showName={showName} handleShowNameChange={handleShowNameChange} />

      <h3>Add a new</h3>
      
      <PersonForm 
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App