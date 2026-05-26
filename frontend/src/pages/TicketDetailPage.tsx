import { useParams, useNavigate } from 'react-router-dom'
import { TicketDetail } from '../components/TicketDetail'

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return null

  return (
    <TicketDetail
      id={id}
      onBack={() => navigate('/tickets')}
    />
  )
}
