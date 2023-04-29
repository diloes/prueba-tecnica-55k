import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UsersList from './components/UsersList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  // Creamos un useRef para guardar el estado original de la data, ya que pervive a los distintos renderizados
  const originalUsers = useRef<User[]>([])

  // Colorear filas:
  const toggleColors = () => {
    setShowColors((prev) => !prev)
  }

  // Ordenar por país:
  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const handleReset = () => {
    // Recupera la data que tenemos en el useRef que pervive a los renderizados
    setUsers(originalUsers.current)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.results)
        // Guardamos el estado original en un useRef que como ya sabemos 'sobrevive' el estado a los renderizados
        originalUsers.current = data.results
      })
      .catch((err) => console.log(err))
  }, [])

  const filteredUsers = useMemo(() => {
    if (filterCountry != null && filterCountry.length > 0) {
      return users.filter((user) =>
        user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase())
      )
    }
    return users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
    }
    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted((a, b) => a.name.first.localeCompare(b.name.first))
    }
    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted((a, b) => a.name.last.localeCompare(b.name.last))
    }
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>Prueba Técnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'Desordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>Reset</button>
        <input
          type='text'
          placeholder='Filtrar por país'
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </header>
      <UsersList
        changeSorting={handleChangeSort}
        users={sortedUsers}
        showColors={showColors}
        deleteUser={handleDelete}
      />
    </>
  )
}

export default App
