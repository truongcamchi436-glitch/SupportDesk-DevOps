import { useState } from 'react'
import styled from 'styled-components'
import { useTicket, useAssignTicket, useUnassignTicket, useCloseTicket, useCancelTicket, useAddComment } from '../hooks/useTickets'

const Wrap = styled.div`
  background: #fff; border-radius: 12px; padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
`
const Btn = styled.button<{ $variant?: 'ghost' | 'danger' }>`
  background: ${p => p.$variant === 'danger' ? '#fee2e2' : p.$variant === 'ghost' ? '#f3f4f6' : '#3b82f6'};
  color: ${p => p.$variant === 'danger' ? '#dc2626' : p.$variant === 'ghost' ? '#374151' : '#fff'};
  border: none; border-radius: 8px;
  padding: 0.55rem 1rem; font-weight: 600; font-size: 0.85rem;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const ActionsRow = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;`
const CommentBox = styled.div`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.75rem; margin-top: 0.5rem; font-size: 0.88rem;
`
const Textarea = styled.textarea`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.6rem 0.9rem; font-size: 0.9rem; width: 100%;
  resize: vertical; min-height: 60px; margin-top: 1rem;
  &:focus { outline: 2px solid #3b82f6; border-color: transparent; }
`
const Divider = styled.hr`border: none; border-top: 1px solid #f0f0f0; margin: 1.25rem 0;`

export const TicketDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const { data: ticket, isLoading } = useTicket(id)
  const { mutate: assign,   isPending: assigning }   = useAssignTicket()
  const { mutate: unassign, isPending: unassigning } = useUnassignTicket()
  const { mutate: close,    isPending: closing }     = useCloseTicket()
  const { mutate: cancel,   isPending: canceling }   = useCancelTicket()
  const { mutate: addComment, isPending: commenting }= useAddComment(id)
  const [comment, setComment] = useState('')

  const role    = localStorage.getItem('role') as 'client' | 'agent'
  const userId  = localStorage.getItem('userId') ?? ''

  if (isLoading || !ticket) return <Wrap>Carregando...</Wrap>

  const isAssignedAgent = ticket.assignedTo?._id === userId
  const isClosed        = ticket.status === 'closed'
  const isCanceled      = ticket.status === 'canceled'
  const isOpen          = ticket.status === 'open'
  const isInProgress    = ticket.status === 'in_progress'

  const isClientOwner       = role === 'client' && ticket.createdBy._id === userId
  const isAssignedAgentUser = role === 'agent' && isAssignedAgent
  const isOpenUnassignedAgent = role === 'agent' && isOpen && !ticket.assignedTo
  const canComment = !isClosed && (isClientOwner || isAssignedAgentUser || isOpenUnassignedAgent)

  const handleComment = () => {
    if (!comment.trim()) return
    addComment(comment, { onSuccess: () => setComment('') })
  }

  return (
    <Wrap>
      <Btn $variant="ghost" onClick={onBack} style={{ marginBottom: '1rem' }}>← Voltar</Btn>

      <h2 style={{ marginBottom: '0.4rem' }}>{ticket.title}</h2>
      <p style={{ color: '#555', marginBottom: '0.5rem' }}>{ticket.description}</p>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>
        por {ticket.createdBy.name}
        {ticket.assignedTo ? ` · agente: ${ticket.assignedTo.name}` : ''}
        {' · status: '}<strong>{ticket.status.replace('_', ' ')}</strong>
      </p>

      <ActionsRow>
        {role === 'agent' && isOpen && (
          <Btn onClick={() => assign(id)} disabled={assigning}>
            {assigning ? 'Atribuindo...' : 'Atribuir a mim'}
          </Btn>
        )}

        {role === 'agent' && isInProgress && isAssignedAgent && (
          <Btn $variant="ghost" onClick={() => unassign(id)} disabled={unassigning}>
            {unassigning ? 'Desatribuindo...' : 'Desatribuir'}
          </Btn>
        )}

        {role === 'agent' && isInProgress && isAssignedAgent && (
          <Btn onClick={() => close(id)} disabled={closing}>
            {closing ? 'Fechando...' : 'Fechar Ticket'}
          </Btn>
        )}

        {role === 'client' && isOpen && isClientOwner && (
          <Btn $variant="danger" onClick={() => cancel(id)} disabled={canceling}>
            {canceling ? 'Cancelando...' : 'Cancelar Ticket'}
          </Btn>
        )}

        {(isClosed || isCanceled) && (
          <span style={{ fontSize: '0.85rem', color: '#888', alignSelf: 'center' }}>
            Ticket {isClosed ? 'fechado' : 'cancelado'} — somente leitura
          </span>
        )}
      </ActionsRow>

      <Divider />

      <h4>Comentários ({ticket.comments.length})</h4>
      {ticket.comments.length === 0 && (
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.5rem' }}>Nenhum comentário ainda.</p>
      )}
      {ticket.comments.map(c => (
        <CommentBox key={c._id}>
          <strong>{c.author?.name}</strong>
          <span style={{ color: '#aaa', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
            {new Date(c.createdAt).toLocaleString('pt-BR')}
          </span>
          <p style={{ marginTop: '0.3rem' }}>{c.body}</p>
        </CommentBox>
      ))}

      {canComment && (
        <>
          <Textarea
            placeholder="Adicionar comentário..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <Btn
            style={{ marginTop: '0.5rem' }}
            disabled={commenting || !comment.trim()}
            onClick={handleComment}
          >
            {commenting ? 'Enviando...' : 'Comentar'}
          </Btn>
        </>
      )}
    </Wrap>
  )
}