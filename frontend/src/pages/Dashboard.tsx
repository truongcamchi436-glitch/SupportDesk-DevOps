import { useState } from 'react'
import styled from 'styled-components'
import { NewTicketForm } from '../components/NewTicketForm'
import { TicketDetail } from '../components/TicketDetail'
import { TicketList } from '../components/TicketList'

const Layout = styled.div`max-width: 860px; margin: 0 auto; padding: 2rem 1rem;`
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
`
const Btn = styled.button<{ $variant?: 'ghost' }>`
  background: ${p => p.$variant === 'ghost' ? '#f3f4f6' : '#3b82f6'};
  color: ${p => p.$variant === 'ghost' ? '#374151' : '#fff'};
  border: none; border-radius: 8px;
  padding: 0.6rem 1.1rem; font-weight: 600; font-size: 0.9rem;
`

export const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [showForm,    setShowForm]    = useState(false)
  const [selectedId,  setSelectedId]  = useState<string | null>(null)

  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')

  return (
    <Layout>
      <Header>
        <h1 style={{ fontSize: '1.3rem' }}>SupportDesk</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>{name} ({role})</span>
          <Btn $variant="ghost" onClick={onLogout}>Sair</Btn>
          {role === 'client' && !selectedId && (
            <Btn onClick={() => setShowForm(v => !v)}>
              {showForm ? 'Cancelar' : '+ Novo Ticket'}
            </Btn>
          )}
        </div>
      </Header>

      {showForm && <NewTicketForm onClose={() => setShowForm(false)} />}

      {selectedId
        ? <TicketDetail id={selectedId} onBack={() => setSelectedId(null)} />
        : <TicketList onSelect={id => { setSelectedId(id); setShowForm(false) }} />
      }
    </Layout>
  )
}