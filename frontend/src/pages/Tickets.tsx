import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Plus, Search, Filter, Inbox } from 'lucide-react'
import { useTickets } from '../hooks/useTickets'
import { useAuth } from '../contexts/AuthContext'
import { TicketCard } from '../components/TicketCard'
import { NewTicketForm } from '../components/NewTicketForm'
import { Button, Input, Skeleton, EmptyState } from '../components/ui'
import type { TicketStatus, TicketPriority } from '../api/tickets'
import type { ThemeColors } from '../styles/global'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;
  flex-wrap: wrap;
`

const Title = styled.h1<{ theme: ThemeColors }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${p => p.theme.textPrimary};
  letter-spacing: -0.03em;
`

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  animation: fadeIn 0.3s ease 0.1s both;
`

const SearchWrap = styled.div<{ theme: ThemeColors }>`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${p => p.theme.textMuted};
    pointer-events: none;
  }

  input {
    padding-left: 2.25rem;
  }
`

const FilterChip = styled.button<{ $active?: boolean; theme: ThemeColors }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? p.theme.brandPrimary : p.theme.border};
  background: ${p => p.$active ? p.theme.brandPrimaryLight : 'transparent'};
  color: ${p => p.$active ? p.theme.brandPrimary : p.theme.textSecondary};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${p => p.theme.brandPrimary}66;
    color: ${p => p.theme.brandPrimary};
  }
`

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

const ResultCount = styled.p<{ theme: ThemeColors }>`
  font-size: 0.8rem;
  color: ${p => p.theme.textMuted};
  margin-bottom: 0.75rem;
  animation: fadeIn 0.3s ease;
`

const SkeletonCard = styled.div<{ theme: ThemeColors }>`
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid ${p => p.theme.border};
`

const FilterSeparator = styled.span<{ theme: ThemeColors }>`
  width: 1px;
  height: 20px;
  background: ${p => p.theme.border};
  margin: 0 0.25rem;
`

const statusFilters: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abertos' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'closed', label: 'Fechados' },
  { value: 'canceled', label: 'Cancelados' },
]

const priorityFilters: { value: TicketPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
]

export const TicketsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: tickets, isLoading, isError } = useTickets()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all')

  const filtered = useMemo(() => {
    if (!tickets) return []
    return tickets.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [tickets, statusFilter, priorityFilter, search])

  return (
    <>
      <Header>
        <Title>Tickets</Title>
        {user?.role === 'client' && (
          <Button onClick={() => setShowForm(v => !v)} $size="sm">
            {showForm ? 'Cancelar' : <><Plus size={16} /> Novo Ticket</>}
          </Button>
        )}
      </Header>

      {showForm && (
        <NewTicketForm onClose={() => setShowForm(false)} />
      )}

      <FiltersRow>
        <SearchWrap>
          <Search size={16} />
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
      </FiltersRow>

      <FiltersRow>
        <Filter size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
        {statusFilters.map(f => (
          <FilterChip
            key={f.value}
            $active={statusFilter === f.value}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </FilterChip>
        ))}
        <FilterSeparator />
        {priorityFilters.map(f => (
          <FilterChip
            key={f.value}
            $active={priorityFilter === f.value}
            onClick={() => setPriorityFilter(f.value)}
          >
            {f.label}
          </FilterChip>
        ))}
      </FiltersRow>

      {isLoading ? (
        <Grid>
          {[0, 1, 2, 3].map(i => (
            <SkeletonCard key={i}>
              <Skeleton $width="60%" $height="0.9rem" style={{ marginBottom: '0.75rem' }} />
              <Skeleton $width="40%" $height="0.75rem" style={{ marginBottom: '0.5rem' }} />
              <Skeleton $width="80%" $height="0.75rem" />
            </SkeletonCard>
          ))}
        </Grid>
      ) : isError ? (
        <EmptyState>
          <Inbox size={48} />
          <p>Erro ao carregar tickets.</p>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <Inbox size={48} />
          <p>
            {search || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Nenhum ticket encontrado com esses filtros.'
              : 'Nenhum ticket encontrado.'}
          </p>
        </EmptyState>
      ) : (
        <>
          <ResultCount>
            {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </ResultCount>
          <Grid>
            {filtered.map(t => (
              <TicketCard
                key={t._id}
                ticket={t}
                onClick={() => navigate(`/tickets/${t._id}`)}
              />
            ))}
          </Grid>
        </>
      )}
    </>
  )
}
