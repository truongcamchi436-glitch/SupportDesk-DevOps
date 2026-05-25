import styled from 'styled-components'
import type { Ticket, TicketPriority, TicketStatus } from '../api/tickets'

const statusMeta: Record<TicketStatus, { label: string; color: string }> = {
  open:        { label: 'Aberto',       color: '#3b82f6' },
  in_progress: { label: 'Em andamento', color: '#f59e0b' },
  closed:      { label: 'Fechado',      color: '#10b981' },
  canceled:    { label: 'Cancelado',    color: '#6b7280' },
}

const priorityMeta: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Baixa', color: '#6b7280' },
  medium: { label: 'Média', color: '#f59e0b' },
  high:   { label: 'Alta',  color: '#ef4444' },
}

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
`
const Row = styled.div`display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;`
const Badge = styled.span<{ $color: string }>`
  background: ${p => p.$color}22;
  color: ${p => p.$color};
  border: 1px solid ${p => p.$color}44;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
`
const Title = styled.h3`font-size: 0.95rem; margin: 0.4rem 0 0.5rem;`
const Meta = styled.span`font-size: 0.75rem; color: #888;`

export const TicketCard = ({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) => {
  const s = statusMeta[ticket.status]
  const p = priorityMeta[ticket.priority]

  return (
    <Card onClick={onClick}>
      <Row>
        <Badge $color={s.color}>{s.label}</Badge>
        <Badge $color={p.color}>{p.label}</Badge>
        <Meta style={{ marginLeft: 'auto' }}>
          {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
        </Meta>
      </Row>
      <Title>{ticket.title}</Title>
      <Row>
        <Meta>por {ticket.createdBy?.name}</Meta>
        {ticket.assignedTo && <Meta>· agente: {ticket.assignedTo.name}</Meta>}
        <Meta>· {ticket.comments.length} comentário(s)</Meta>
      </Row>
    </Card>
  )
}