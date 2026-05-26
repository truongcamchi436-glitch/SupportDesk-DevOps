import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Headphones, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Button, Input, ErrorText } from '../components/ui'
import type { ThemeColors } from '../styles/global'

const Wrapper = styled.div<{ theme: ThemeColors }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.theme.bgPrimary};
  padding: 1rem;
`

const Container = styled.div`
  width: 100%;
  max-width: 420px;
  animation: fadeIn 0.4s ease;
`

const Card = styled.div<{ theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border-radius: 20px;
  border: 1px solid ${p => p.theme.border};
  padding: 2.5rem 2rem;
  box-shadow: ${p => p.theme.shadowLg};
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
`

const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`

const LogoIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
`

const Title = styled.h1<{ theme: ThemeColors }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${p => p.theme.textPrimary};
  letter-spacing: -0.02em;
`

const Subtitle = styled.p<{ theme: ThemeColors }>`
  font-size: 0.875rem;
  color: ${p => p.theme.textMuted};
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const Label = styled.label<{ theme: ThemeColors }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.theme.textSecondary};
`

const PasswordWrap = styled.div`
  position: relative;
`

const TogglePassword = styled.button<{ theme: ThemeColors }>`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${p => p.theme.textMuted};
  padding: 4px;
  display: flex;

  &:hover {
    color: ${p => p.theme.textSecondary};
  }
`

const Footer = styled.p<{ theme: ThemeColors }>`
  text-align: center;
  font-size: 0.85rem;
  color: ${p => p.theme.textMuted};
  margin-top: 0.5rem;

  a {
    color: ${p => p.theme.brandPrimary};
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`

export const Login = () => {
  const { login } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      toast.success('Login realizado com sucesso!')
    } catch {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Container>
        <Card>
          <LogoWrap>
            <LogoIcon>
              <Headphones size={26} />
            </LogoIcon>
            <Title>SupportDesk</Title>
            <Subtitle>Faça login para continuar</Subtitle>
          </LogoWrap>

          <InputGroup>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              $hasError={!!error}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="login-password">Senha</Label>
            <PasswordWrap>
              <Input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                $hasError={!!error}
                style={{ paddingRight: '2.5rem' }}
              />
              <TogglePassword
                type="button"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </TogglePassword>
            </PasswordWrap>
          </InputGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <Button onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Card>

        <Footer>
          Não tem uma conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </Footer>
      </Container>
    </Wrapper>
  )
}