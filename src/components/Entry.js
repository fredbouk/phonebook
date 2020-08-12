import React from 'react'
import personService from '../services/resources'

const Entry = ({ id, name, number, setPersons, persons, setNotification, setErrorNotification }) => {
  const removeAndUpdate = (id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.del(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))

          setNotification(`Deleted ${name}`)
          setTimeout(() => {
            setNotification('')
          }, 4000)
        })
        .catch(error => {
          console.log(error)
          setErrorNotification(`${name} is already deleted from the server`)
          setTimeout(() => {
            setErrorNotification('')
            setPersons(persons.filter(person => person.id !== id))
          }, 4000)
        })
    }
  }

  return (
    <li>
      {name} {number}
      &nbsp; <button onClick={() => removeAndUpdate(id)}>delete</button>
    </li>
  )
}

export default Entry
