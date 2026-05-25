import { api } from './api'

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'canceled'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface UserRef {
  _id: string
  name: string
  email: string
}

export interface Comment {
  _id: string
  author: UserRef
  body: string
  createdAt: string
}

export interface Ticket {
  _id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdBy: UserRef
  assignedTo?: UserRef | null
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export const getTickets = () =>
  api.get<Ticket[]>('/tickets').then((r) => r.data)

export const getTicket = (id: string) =>
  api.get<Ticket>(`/tickets/${id}`).then((r) => r.data)

export const createTicket = (data: {
  title: string
  description: string
  priority?: TicketPriority
}) => api.post<Ticket>('/tickets', data).then((r) => r.data)

export const assignTicket = (id: string) =>
  api.patch<Ticket>(`/tickets/${id}/assign`).then((r) => r.data)

export const unassignTicket = (id: string) =>
  api.patch<Ticket>(`/tickets/${id}/unassign`).then((r) => r.data)

export const closeTicket = (id: string) =>
  api.patch<Ticket>(`/tickets/${id}/close`).then((r) => r.data)

export const cancelTicket = (id: string) =>
  api.patch<Ticket>(`/tickets/${id}/cancel`).then((r) => r.data)

export const addComment = (id: string, body: string) =>
  api.post<Ticket>(`/tickets/${id}/comments`, { body }).then((r) => r.data)