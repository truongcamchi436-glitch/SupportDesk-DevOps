import styled from 'styled-components'
import { useTickets } from '../hooks/useTickets'
import { TicketCard } from './TicketCard'
import type { ThemeColors } from '../styles/global'

const Grid = styled.div`display: flex; flex-direction: column; gap: 0.75rem;`
const Empty = styled.p<{ theme: ThemeColors }>`
  color: ${p => p.theme.textMuted};
  text-align: center;
  padding: 2rem;
`

export const TicketList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { data: tickets, isLoading, isError } = useTickets()

  if (isLoading) return <Empty>Carregando tickets...</Empty>
  if (isError)   return <Empty>Erro ao carregar tickets.</Empty>
  if (!tickets?.length) return <Empty>Nenhum ticket encontrado.</Empty>

  return (
    <Grid>
      {tickets.map(t => (
        <TicketCard key={t._id} ticket={t} onClick={() => onSelect(t._id)} />
      ))}
    </Grid>
  )
}