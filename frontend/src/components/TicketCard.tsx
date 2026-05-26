import styled, { useTheme } from 'styled-components'
import type { Ticket, TicketPriority, TicketStatus } from '../api/tickets'
import { Card, Badge } from './ui'
import type { ThemeColors } from '../styles/global'

const Row = styled.div`display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;`

const Title = styled.h3<{ theme: ThemeColors }>`
  font-size: 0.95rem;
  margin: 0.4rem 0 0.5rem;
  color: ${p => p.theme.textPrimary};
`

const Meta = styled.span<{ theme: ThemeColors }>`
  font-size: 0.75rem;
  color: ${p => p.theme.textMuted};
`

export const TicketCard = ({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) => {
  const theme = useTheme() as ThemeColors

  const statusMeta: Record<TicketStatus, { label: string; color: string }> = {
    open:        { label: 'Aberto',       color: theme.accentInfo },
    in_progress: { label: 'Em andamento', color: theme.accentWarning },
    closed:      { label: 'Fechado',      color: theme.accentSuccess },
    canceled:    { label: 'Cancelado',    color: theme.textMuted },
  }

  const priorityMeta: Record<TicketPriority, { label: string; color: string }> = {
    low:    { label: 'Baixa', color: theme.textMuted },
    medium: { label: 'Média', color: theme.accentWarning },
    high:   { label: 'Alta',  color: theme.accentDanger },
  }

  const s = statusMeta[ticket.status]
  const p = priorityMeta[ticket.priority]

  return (
    <Card $clickable onClick={onClick}>
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