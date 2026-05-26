import { AlertTriangle } from 'lucide-react'
import styled from 'styled-components'
import { Button, Overlay, ModalCard } from './ui'
import type { ThemeColors } from '../styles/global'

const Title = styled.h3<{ theme: ThemeColors }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${p => p.theme.textPrimary};
`

const Description = styled.p<{ theme: ThemeColors }>`
  font-size: 0.9rem;
  color: ${p => p.theme.textSecondary};
  line-height: 1.5;
`

const IconWrap = styled.div<{ theme: ThemeColors }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${p => p.theme.accentWarningLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.accentWarning};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`

interface Props {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  variant?: 'danger' | 'primary'
}

export const ConfirmModal = ({ title, description, confirmLabel, onConfirm, onCancel, loading, variant = 'danger' }: Props) => (
  <Overlay onClick={onCancel}>
    <ModalCard onClick={e => e.stopPropagation()}>
      <IconWrap>
        <AlertTriangle size={22} />
      </IconWrap>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Actions>
        <Button $variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button $variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? 'Aguarde...' : confirmLabel}
        </Button>
      </Actions>
    </ModalCard>
  </Overlay>
)
