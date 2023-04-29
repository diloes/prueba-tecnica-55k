import { SortBy, User } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (email: string) => void
  changeSorting: (sort: SortBy) => void
}

export default function UsersList({ changeSorting, users, showColors = false, deleteUser }: Props) {
  return (
    <table width={'100%'}>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => changeSorting(SortBy.NAME)}>
            Nombre
          </th>
          <th className='pointer' onClick={() => changeSorting(SortBy.LAST)}>
            Apellido
          </th>
          <th className='pointer' onClick={() => changeSorting(SortBy.COUNTRY)}>
            País
          </th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => {
          // Colorear filas:
          const backgroundColor = index % 2 === 0 ? '#333' : '#555'
          const colors = showColors ? backgroundColor : 'transparent'

          return (
            <tr key={user.email} style={{ backgroundColor: colors }}>
              <td>
                <img src={user.picture.thumbnail} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUser(user.email)}>Eliminar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
