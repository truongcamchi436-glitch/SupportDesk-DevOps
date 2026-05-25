import { useState } from 'react'
import styled from 'styled-components'
import { useCreateTicket } from '../hooks/useTickets'
import type { TicketPriority } from '../api/tickets'

const Form = styled.div`
  background: #fff; border-radius: 12px; padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  display: flex; flex-direction: column; gap: 0.75rem;
  margin-bottom: 1.5rem;
`
const Input = styled.input`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.6rem 0.9rem; font-size: 0.9rem; width: 100%;
  &:focus { outline: 2px solid #3b82f6; border-color: transparent; }
`
const Textarea = styled.textarea`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.6rem 0.9rem; font-size: 0.9rem; width: 100%;
  resize: vertical; min-height: 80px;
  &:focus { outline: 2px solid #3b82f6; border-color: transparent; }
`
const Select = styled.select`
  border: 1px solid #e0e0e0; border-radius: 8px;
  padding: 0.6rem 0.9rem; font-size: 0.9rem; width: 100%;
`
const Row = styled.div`display: flex; gap: 0.5rem;`
const Btn = styled.button<{ $variant?: 'ghost' }>`
  background: ${p => p.$variant === 'ghost' ? '#f3f4f6' : '#3b82f6'};
  color: ${p => p.$variant === 'ghost' ? '#374151' : '#fff'};
  border: none; border-radius: 8px;
  padding: 0.65rem 1.2rem; font-weight: 600; font-size: 0.9rem;
  &:disabled { opacity: 0.6; }
`

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
        <Btn onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Criando...' : 'Criar Ticket'}
        </Btn>
        <Btn $variant="ghost" onClick={onClose}>Cancelar</Btn>
      </Row>
    </Form>
  )
}