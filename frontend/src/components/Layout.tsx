import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  LayoutDashboard, Ticket, LogOut, Moon, Sun,
  Menu, X, Headphones
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import type { ThemeColors } from '../styles/global'

const SidebarContainer = styled.aside<{ $open: boolean; theme: ThemeColors }>`
  width: 260px;
  min-height: 100vh;
  background: ${p => p.theme.bgSidebar};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${p => p.$open ? '4px 0 24px rgba(0,0,0,0.3)' : 'none'};
  }
`

const MobileOverlay = styled.div<{ $open: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${p => p.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
`

const MobileToggle = styled.button<{ theme: ThemeColors }>`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.bgCard};
  color: ${p => p.theme.textPrimary};
  align-items: center;
  justify-content: center;
  box-shadow: ${p => p.theme.shadowMd};

  @media (max-width: 768px) {
    display: flex;
  }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`

const BrandIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const BrandName = styled.h1`
  font-size: 1.15rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.02em;
`

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
`

const NavItem = styled.button<{ $active?: boolean; theme: ThemeColors }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border-radius: 10px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;

  background: ${p => p.$active ? 'rgba(99, 102, 241, 0.15)' : 'transparent'};
  color: ${p => p.$active ? '#a5b4fc' : '#94a3b8'};

  &:hover {
    background: ${p => p.$active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${p => p.$active ? '#a5b4fc' : '#e2e8f0'};
  }

  svg {
    flex-shrink: 0;
  }
`

const NavLabel = styled.span<{ theme: ThemeColors }>`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  padding: 0 0.75rem;
  margin: 1rem 0 0.5rem;
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.25rem;
`

const Avatar = styled.div<{ theme: ThemeColors }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
`

const UserName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserRole = styled.span`
  font-size: 0.7rem;
  color: #64748b;
  text-transform: capitalize;
`

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: hidden;
`

const ContentWrapper = styled.main<{ theme: ThemeColors }>`
  margin-left: 260px;
  min-height: 100vh;
  background: ${p => p.theme.bgPrimary};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ContentInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    padding: 4.5rem 1rem 2rem;
  }
`

interface Props {
  children: React.ReactNode
}

export const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { mode, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const roleLabel = user?.role === 'agent' ? 'Agente' : 'Cliente'

  return (
    <>
      <MobileOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <MobileToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </MobileToggle>

      <SidebarContainer $open={sidebarOpen}>
        <Brand>
          <BrandIcon>
            <Headphones size={20} />
          </BrandIcon>
          <BrandName>SupportDesk</BrandName>
        </Brand>

        <Nav>
          <NavLabel>Menu</NavLabel>

          <NavItem
            $active={location.pathname === '/dashboard'}
            onClick={() => handleNavigate('/dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavItem>

          <NavItem
            $active={location.pathname === '/tickets' || location.pathname.startsWith('/tickets/')}
            onClick={() => handleNavigate('/tickets')}
          >
            <Ticket size={18} />
            Tickets
          </NavItem>
        </Nav>

        <BottomSection>
          <NavItem onClick={toggle}>
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {mode === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </NavItem>

          <NavItem onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </NavItem>

          <UserInfo>
            <Avatar>{initials}</Avatar>
            <UserText>
              <UserName>{user?.name}</UserName>
              <UserRole>{roleLabel}</UserRole>
            </UserText>
          </UserInfo>
        </BottomSection>
      </SidebarContainer>

      <ContentWrapper>
        <ContentInner>
          {children}
        </ContentInner>
      </ContentWrapper>
    </>
  )
}
