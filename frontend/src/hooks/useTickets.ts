import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, assignTicket, cancelTicket, closeTicket, createTicket, getTicket, getTickets, unassignTicket } from "../api/tickets";

const invalidateBoth = (qc: ReturnType<typeof useQueryClient>, id?: string) => {
  qc.invalidateQueries({ queryKey: ['tickets'] })
  if (id) qc.invalidateQueries({ queryKey: ['tickets', id] })
}

export const useTickets = () =>
  useQuery({ queryKey: ['tickets'], queryFn: getTickets })

export const useTicket = (id: string) => 
  useQuery({ queryKey: ['ticket'], queryFn: () => getTicket(id), enabled: !!id })

export const useCreateTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }),
  })
}

export const useAssignTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assignTicket(id),
    onSuccess: (_, id) => invalidateBoth(qc, id),
  })
}

export const useUnassignTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unassignTicket(id),
    onSuccess: (_, id) => invalidateBoth(qc, id),
  })
}

export const useCloseTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => closeTicket(id),
    onSuccess: (_, id) => invalidateBoth(qc, id),
  })
}

export const useCancelTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelTicket(id),
    onSuccess: (_, id) => invalidateBoth(qc, id),
  })
}

export const useAddComment = (ticketId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => addComment(ticketId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ticket', ticketId] }),
  })
}
