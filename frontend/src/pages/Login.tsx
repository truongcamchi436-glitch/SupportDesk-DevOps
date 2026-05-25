import { useState } from 'react'
import styled from 'styled-components'
import { loginApi } from '../api/auth'

const Wrapper = styled.div`
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
`
const Card = styled.div`
  background: #fff; border-radius: 16px; padding: 2.5rem 2rem;
  width: 100%; max-width: 380px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  display: flex; flex-direction: column; gap: 1rem;
`
const Input = styled.input`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.7rem 1rem; font-size: 0.95rem; width: 100%;
  &:focus { outline: 2px solid #3b82f6; border-color: transparent; }
`
const Btn = styled.button`
  background: #3b82f6; color: #fff; border: none; border-radius: 8px;
  padding: 0.75rem; font-weight: 700; font-size: 1rem; width: 100%;
  &:disabled { opacity: 0.6; }
`
const Error = styled.p`color: #ef4444; font-size: 0.85rem;`

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setLoading(true); setError('')
    try {
      const res = await loginApi(email, password)
      localStorage.setItem('token',  res.data.token)
      localStorage.setItem('role',   res.data.user.role)
      localStorage.setItem('name',   res.data.user.name)
      const payload = JSON.parse(atob(res.data.token.split('.')[1]))
      localStorage.setItem('userId', payload.id)
      onLogin()
    } catch {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Card>
        <h2 style={{ textAlign: 'center' }}>SupportDesk</h2>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        {error && <Error>{error}</Error>}
        <Btn onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Btn>
      </Card>
    </Wrapper>
  )
}