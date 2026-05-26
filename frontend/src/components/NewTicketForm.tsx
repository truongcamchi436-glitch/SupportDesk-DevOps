import { useState } from 'react'
import styled from 'styled-components'
import { useCreateTicket } from '../hooks/useTickets'
import type { TicketPriority } from '../api/tickets'
import { Button, Input, Textarea, Select } from './ui'
import type { ThemeColors } from '../styles/global'

const Form = styled.div<{ theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border: 1px solid ${p => p.theme.border};
  color: ${p => p.theme.textPrimary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${p => p.theme.shadowSm};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`
const Row = styled.div`display: flex; gap: 0.5rem;`

export const NewTicketForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const { mutate, isPending } = useCreateTicket()

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return
    mutate({ title, description, priority }, { onSuccess: onClose })
  }

  return (
    <Form>
      <h3 style={{ margin: 0 }}>Novo Ticket</h3>
      <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <Textarea placeholder="Descrição do problema..." value={description} onChange={e => setDescription(e.target.value)} />
      <Select value={priority} onChange={e => setPriority(e.target.value as TicketPriority)}>
        <option value="low">Baixa prioridade</option>
        <option value="medium">Média prioridade</option>
        <option value="high">Alta prioridade</option>
      </Select>
      <Row>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Criando...' : 'Criar Ticket'}
        </Button>
        <Button $variant="ghost" onClick={onClose}>Cancelar</Button>
      </Row>
    </Form>
  )
}