import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/resources'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState('')
  const [errorNotification, setErrorNotification] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(error)
        setErrorNotification('Could not connect to server')
        setTimeout(() => {
          setErrorNotification('')
        }, 4000)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const regex = new RegExp(`.*${newFilter}`, 'i')

  const personsToShow = newFilter
    ? persons.filter(obj => regex.test(obj.name))
    : persons

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const addEntry = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(ojb => ojb.name.toLowerCase() === newName.toLowerCase())
    const updatePerson = { ...existingPerson, number: newNumber }

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(updatePerson.id, updatePerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatePerson.id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            setNotification(`Updated ${updatePerson.name}'s number`)
            setTimeout(() => {
              setNotification('')
            }, 4000)
          }
          )
          .catch(error => {
            console.log(error)
            setErrorNotification(`Could not update number! ${updatePerson.name} is deleted from the server`)
            setTimeout(() => {
              setErrorNotification('')
              setPersons(persons.filter(person => person.id !== updatePerson.id))
            }, 4000)
          })
      }
    } else {
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification('')
          }, 4000)
        })
        .catch(error => {
          console.log(error)
          setErrorNotification(`Failed to add ${personObject.name}. Could not connect to server`)
          setTimeout(() => {
            setErrorNotification('')
          }, 4000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} />
      <ErrorNotification message={errorNotification} />

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addEntry={addEntry}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Entries</h3>

      <Persons
        personsToShow={personsToShow}
        setPersons={setPersons}
        persons={persons}
        setNotification={setNotification}
        setErrorNotification={setErrorNotification}
      />
    </div>
  )
}

export default App
