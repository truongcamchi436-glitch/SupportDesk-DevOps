import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Ticket, Clock, CheckCircle, XCircle,
  AlertTriangle, ArrowRight, TrendingUp
} from 'lucide-react'
import { useTickets } from '../hooks/useTickets'
import { useAuth } from '../contexts/AuthContext'
import { Button, Skeleton } from '../components/ui'
import type { ThemeColors } from '../styles/global'

const Header = styled.div`
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease;
`

const Greeting = styled.h1<{ theme: ThemeColors }>`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${p => p.theme.textPrimary};
  letter-spacing: -0.03em;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`

const SubGreeting = styled.p<{ theme: ThemeColors }>`
  font-size: 0.9rem;
  color: ${p => p.theme.textMuted};
  margin-top: 0.25rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div<{ $delay?: number; theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border: 1px solid ${p => p.theme.border};
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: fadeIn 0.4s ease ${p => (p.$delay || 0) * 0.1}s both;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${p => p.theme.brandPrimary}44;
    box-shadow: ${p => p.theme.shadowMd};
    transform: translateY(-2px);
  }
`

const StatIcon = styled.div<{ $bg: string; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
`

const StatValue = styled.span<{ theme: ThemeColors }>`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${p => p.theme.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1;
`

const StatLabel = styled.span<{ theme: ThemeColors }>`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${p => p.theme.textMuted};
`

const Section = styled.div`
  animation: fadeIn 0.4s ease 0.3s both;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h2<{ theme: ThemeColors }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${p => p.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const RecentItem = styled.div<{ theme: ThemeColors }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: ${p => p.theme.bgCard};
  border: 1px solid ${p => p.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${p => p.theme.brandPrimary}44;
    box-shadow: ${p => p.theme.shadowSm};
    transform: translateX(4px);
  }
`

const RecentTitle = styled.span<{ theme: ThemeColors }>`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${p => p.theme.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RecentMeta = styled.span<{ theme: ThemeColors }>`
  font-size: 0.75rem;
  color: ${p => p.theme.textMuted};
  white-space: nowrap;
`

const StatusDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`

const statusColors: Record<string, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  closed: '#10b981',
  canceled: '#6b7280',
}

const SkeletonGrid = () => (
  <StatsGrid>
    {[0, 1, 2, 3].map(i => (
      <StatCard key={i}>
        <Skeleton $width="40px" $height="40px" />
        <Skeleton $width="60px" $height="2rem" />
        <Skeleton $width="80px" $height="0.8rem" />
      </StatCard>
    ))}
  </StatsGrid>
)

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: tickets, isLoading } = useTickets()

  const stats = useMemo(() => {
    if (!tickets) return { total: 0, open: 0, inProgress: 0, closed: 0, canceled: 0 }
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      canceled: tickets.filter(t => t.status === 'canceled').length,
    }
  }, [tickets])

  const recentTickets = useMemo(() => {
    if (!tickets) return []
    return [...tickets]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [tickets])

  const firstName = user?.name?.split(' ')[0] || 'Usuário'

  return (
    <>
      <Header>
        <Greeting>Olá, {firstName} 👋</Greeting>
        <SubGreeting>
          Aqui está o resumo dos seus tickets
        </SubGreeting>
      </Header>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <StatsGrid>
          <StatCard $delay={0}>
            <StatIcon $bg="rgba(99, 102, 241, 0.1)" $color="#6366f1">
              <Ticket size={20} />
            </StatIcon>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total de Tickets</StatLabel>
          </StatCard>

          <StatCard $delay={1}>
            <StatIcon $bg="rgba(59, 130, 246, 0.1)" $color="#3b82f6">
              <Clock size={20} />
            </StatIcon>
            <StatValue>{stats.open}</StatValue>
            <StatLabel>Abertos</StatLabel>
          </StatCard>

          <StatCard $delay={2}>
            <StatIcon $bg="rgba(245, 158, 11, 0.1)" $color="#f59e0b">
              <AlertTriangle size={20} />
            </StatIcon>
            <StatValue>{stats.inProgress}</StatValue>
            <StatLabel>Em Andamento</StatLabel>
          </StatCard>

          <StatCard $delay={3}>
            <StatIcon $bg="rgba(16, 185, 129, 0.1)" $color="#10b981">
              <CheckCircle size={20} />
            </StatIcon>
            <StatValue>{stats.closed}</StatValue>
            <StatLabel>Fechados</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>
            <TrendingUp size={18} />
            Tickets Recentes
          </SectionTitle>
          <Button $variant="ghost" $size="sm" onClick={() => navigate('/tickets')}>
            Ver todos <ArrowRight size={14} />
          </Button>
        </SectionHeader>

        {isLoading ? (
          <RecentList>
            {[0, 1, 2].map(i => (
              <RecentItem key={i}>
                <Skeleton $width="8px" $height="8px" style={{ borderRadius: '50%' }} />
                <Skeleton $width="60%" $height="0.875rem" />
                <Skeleton $width="80px" $height="0.75rem" />
              </RecentItem>
            ))}
          </RecentList>
        ) : recentTickets.length === 0 ? (
          <RecentItem>
            <XCircle size={16} style={{ color: '#94a3b8' }} />
            <RecentTitle>Nenhum ticket encontrado</RecentTitle>
          </RecentItem>
        ) : (
          <RecentList>
            {recentTickets.map(ticket => (
              <RecentItem key={ticket._id} onClick={() => navigate(`/tickets/${ticket._id}`)}>
                <StatusDot $color={statusColors[ticket.status] || '#888'} />
                <RecentTitle>{ticket.title}</RecentTitle>
                <RecentMeta>
                  {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
                </RecentMeta>
              </RecentItem>
            ))}
          </RecentList>
        )}
      </Section>
    </>
  )
}