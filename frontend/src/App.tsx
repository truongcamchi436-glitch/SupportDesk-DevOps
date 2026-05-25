import { useState } from 'react'
import { GlobalStyle } from './styles/global'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'

export const App = () => {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.clear()
    setAuthed(false)
  }

  return (
    <>
      <GlobalStyle />
      {authed ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => setAuthed(true)} />
      )}
    </>
  )
}