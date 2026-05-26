import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import styled from 'styled-components'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import type { ThemeColors } from '../styles/global'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  exiting?: boolean
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let toastIdCounter = 0

const Container = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 380px;

  @media (max-width: 480px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`

const ToastItem = styled.div<{ $type: ToastType; $exiting?: boolean; theme: ThemeColors }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${p => p.theme.bgCard};
  border: 1px solid ${p =>
    p.$type === 'success' ? p.theme.accentSuccess :
    p.$type === 'error' ? p.theme.accentDanger :
    p.theme.accentInfo
  }33;
  box-shadow: ${p => p.theme.shadowLg};
  animation: ${p => p.$exiting ? 'toastOut' : 'toastIn'} 0.3s ease forwards;
  backdrop-filter: blur(12px);

  svg:first-child {
    flex-shrink: 0;
    color: ${p =>
      p.$type === 'success' ? p.theme.accentSuccess :
      p.$type === 'error' ? p.theme.accentDanger :
      p.theme.accentInfo
    };
  }
`

const Message = styled.span<{ theme: ThemeColors }>`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${p => p.theme.textPrimary};
  line-height: 1.4;
`

const CloseBtn = styled.button<{ theme: ThemeColors }>`
  background: none;
  border: none;
  padding: 2px;
  color: ${p => p.theme.textMuted};
  border-radius: 4px;
  display: flex;
  transition: color 0.2s;

  &:hover {
    color: ${p => p.theme.textPrimary};
  }
`

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast])
  const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast])
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast])

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <Container>
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <ToastItem key={toast.id} $type={toast.type} $exiting={toast.exiting}>
              <Icon size={18} />
              <Message>{toast.message}</Message>
              <CloseBtn onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </CloseBtn>
            </ToastItem>
          )
        })}
      </Container>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
