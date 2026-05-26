import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useTicket, useAssignTicket, useUnassignTicket, useCloseTicket, useCancelTicket, useAddComment } from '../hooks/useTickets'
import { Button, Textarea, Divider } from './ui'
import type { ThemeColors } from '../styles/global'

const Wrap = styled.div<{ theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border: 1px solid ${p => p.theme.border};
  color: ${p => p.theme.textPrimary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${p => p.theme.shadowSm};
`
const ActionsRow = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;`
const CommentBox = styled.div<{ theme: ThemeColors }>`
  border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.bgPrimary};
  color: ${p => p.theme.textPrimary};
  border-radius: 8px;
  padding: 0.75rem; margin-top: 0.5rem; font-size: 0.88rem;
`

export const TicketDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const { data: ticket, isLoading } = useTicket(id)
  const { mutate: assign,   isPending: assigning }   = useAssignTicket()
  const { mutate: unassign, isPending: unassigning } = useUnassignTicket()
  const { mutate: close,    isPending: closing }     = useCloseTicket()
  const { mutate: cancel,   isPending: canceling }   = useCancelTicket()
  const { mutate: addComment, isPending: commenting }= useAddComment(id)
  const [comment, setComment] = useState('')
  const theme = useTheme() as ThemeColors

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
      <Button $variant="ghost" $size="sm" onClick={onBack} style={{ marginBottom: '1rem' }}>← Voltar</Button>

      <h2 style={{ marginBottom: '0.4rem' }}>{ticket.title}</h2>
      <p style={{ color: theme.textSecondary, marginBottom: '0.5rem' }}>{ticket.description}</p>
      <p style={{ fontSize: '0.8rem', color: theme.textMuted }}>
        por {ticket.createdBy.name}
        {ticket.assignedTo ? ` · agente: ${ticket.assignedTo.name}` : ''}
        {' · status: '}<strong>{ticket.status.replace('_', ' ')}</strong>
      </p>

      <ActionsRow>
        {role === 'agent' && isOpen && (
          <Button $size="sm" onClick={() => assign(id)} disabled={assigning}>
            {assigning ? 'Atribuindo...' : 'Atribuir a mim'}
          </Button>
        )}

        {role === 'agent' && isInProgress && isAssignedAgent && (
          <Button $variant="ghost" $size="sm" onClick={() => unassign(id)} disabled={unassigning}>
            {unassigning ? 'Desatribuindo...' : 'Desatribuir'}
          </Button>
        )}

        {role === 'agent' && isInProgress && isAssignedAgent && (
          <Button $size="sm" onClick={() => close(id)} disabled={closing}>
            {closing ? 'Fechando...' : 'Fechar Ticket'}
          </Button>
        )}

        {role === 'client' && isOpen && isClientOwner && (
          <Button $variant="danger" $size="sm" onClick={() => cancel(id)} disabled={canceling}>
            {canceling ? 'Cancelando...' : 'Cancelar Ticket'}
          </Button>
        )}

        {(isClosed || isCanceled) && (
          <span style={{ fontSize: '0.85rem', color: theme.textMuted, alignSelf: 'center' }}>
            Ticket {isClosed ? 'fechado' : 'cancelado'} (somente leitura)
          </span>
        )}
      </ActionsRow>

      <Divider />

      <h4>Comentários ({ticket.comments.length})</h4>
      {ticket.comments.length === 0 && (
        <p style={{ color: theme.textMuted, fontSize: '0.85rem', marginTop: '0.5rem' }}>Nenhum comentário ainda.</p>
      )}
      {ticket.comments.map(c => (
        <CommentBox key={c._id}>
          <strong>{c.author?.name}</strong>
          <span style={{ color: theme.textMuted, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
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
          <Button
            style={{ marginTop: '0.5rem' }}
            disabled={commenting || !comment.trim()}
            onClick={handleComment}
          >
            {commenting ? 'Enviando...' : 'Comentar'}
          </Button>
        </>
      )}
    </Wrap>
  )
}