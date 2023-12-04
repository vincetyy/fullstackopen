const Person = ({person, deletePerson}) => {
    return (
      <p>
        {person.name} {person.number} <button onClick={deletePerson}>Delete</button>
      </p>
    )
  }
  
  const Persons = ({persons, deletePerson}) => {
    return (
      persons.map(person => <Person key={person.name} person={person} deletePerson={() => deletePerson(person.id)}/>)
    )
  }

export default Persons