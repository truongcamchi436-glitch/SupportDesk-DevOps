import type { TicketPriority, TicketStatus } from '../api/tickets'

export type UserRole = 'client' | 'agent'

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  closed: 'Fechado',
  canceled: 'Cancelado',
}

export const TICKET_PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  client: 'Cliente',
  agent: 'Agente',
}