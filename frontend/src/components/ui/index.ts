import styled, { keyframes } from 'styled-components'
import type { ThemeColors } from '../../styles/global'

// ─── Buttons ───────────────────────────────────────────────

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  $size?: 'sm' | 'md'
  theme: ThemeColors
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  transition: all 0.2s ease;
  white-space: nowrap;

  padding: ${p => p.$size === 'sm' ? '0.5rem 0.875rem' : '0.65rem 1.25rem'};
  font-size: ${p => p.$size === 'sm' ? '0.8rem' : '0.875rem'};

  ${p => {
    switch (p.$variant) {
      case 'secondary':
        return `
          background: ${p.theme.bgTertiary};
          color: ${p.theme.textPrimary};
          &:hover { background: ${p.theme.border}; }
        `
      case 'ghost':
        return `
          background: transparent;
          color: ${p.theme.textSecondary};
          &:hover { background: ${p.theme.bgTertiary}; color: ${p.theme.textPrimary}; }
        `
      case 'danger':
        return `
          background: ${p.theme.accentDangerLight};
          color: ${p.theme.accentDanger};
          &:hover { background: ${p.theme.accentDanger}; color: white; }
        `
      default:
        return `
          background: ${p.theme.brandGradient};
          color: white;
          box-shadow: 0 2px 8px ${p.theme.brandPrimary}33;
          &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px ${p.theme.brandPrimary}44; }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
`

// ─── Inputs ────────────────────────────────────────────────

export const Input = styled.input<{ $hasError?: boolean; theme: ThemeColors }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border-radius: 10px;
  border: 1.5px solid ${p => p.$hasError ? p.theme.accentDanger : p.theme.border};
  background: ${p => p.theme.bgInput};
  color: ${p => p.theme.textPrimary};
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: ${p => p.theme.textMuted};
  }

  &:focus {
    border-color: ${p => p.$hasError ? p.theme.accentDanger : p.theme.borderFocus};
    box-shadow: 0 0 0 3px ${p => p.$hasError ? p.theme.accentDangerLight : p.theme.brandPrimaryLight};
  }
`

export const Textarea = styled.textarea<{ theme: ThemeColors }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border-radius: 10px;
  border: 1.5px solid ${p => p.theme.border};
  background: ${p => p.theme.bgInput};
  color: ${p => p.theme.textPrimary};
  transition: all 0.2s ease;
  outline: none;
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;

  &::placeholder {
    color: ${p => p.theme.textMuted};
  }

  &:focus {
    border-color: ${p => p.theme.borderFocus};
    box-shadow: 0 0 0 3px ${p => p.theme.brandPrimaryLight};
  }
`

export const Select = styled.select<{ theme: ThemeColors }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border-radius: 10px;
  border: 1.5px solid ${p => p.theme.border};
  background: ${p => p.theme.bgInput};
  color: ${p => p.theme.textPrimary};
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${p => p.theme.borderFocus};
    box-shadow: 0 0 0 3px ${p => p.theme.brandPrimaryLight};
  }
`

// ─── Cards ─────────────────────────────────────────────────

export const Card = styled.div<{ $clickable?: boolean; theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border-radius: 14px;
  border: 1px solid ${p => p.theme.border};
  padding: 1.25rem;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease;

  ${p => p.$clickable && `
    cursor: pointer;
    &:hover {
      border-color: ${p.theme.brandPrimary}44;
      box-shadow: ${p.theme.shadowMd};
      transform: translateY(-2px);
    }
  `}
`

// ─── Badges ────────────────────────────────────────────────

export const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 6px;
  background: ${p => p.$color}18;
  color: ${p => p.$color};
  border: 1px solid ${p => p.$color}30;
`

// ─── Layout ────────────────────────────────────────────────

export const Divider = styled.hr<{ theme: ThemeColors }>`
  border: none;
  border-top: 1px solid ${p => p.theme.border};
  margin: 1.25rem 0;
`

// ─── Skeleton Loader ───────────────────────────────────────

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

export const Skeleton = styled.div<{ $width?: string; $height?: string; theme: ThemeColors }>`
  width: ${p => p.$width || '100%'};
  height: ${p => p.$height || '1rem'};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${p => p.theme.bgTertiary} 25%,
    ${p => p.theme.border} 50%,
    ${p => p.theme.bgTertiary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite ease-in-out;
`

// ─── Modal ─────────────────────────────────────────────────

export const Overlay = styled.div<{ theme: ThemeColors }>`
  position: fixed;
  inset: 0;
  background: ${p => p.theme.bgOverlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  padding: 1rem;
`

export const ModalCard = styled.div<{ theme: ThemeColors }>`
  background: ${p => p.theme.bgCard};
  border-radius: 16px;
  padding: 1.75rem;
  width: 100%;
  max-width: 420px;
  box-shadow: ${p => p.theme.shadowLg};
  animation: slideInUp 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

// ─── Empty State ───────────────────────────────────────────

export const EmptyState = styled.div<{ theme: ThemeColors }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: ${p => p.theme.textMuted};
  text-align: center;

  svg {
    opacity: 0.4;
  }

  p {
    font-size: 0.9rem;
  }
`

// ─── Error Text ────────────────────────────────────────────

export const ErrorText = styled.p<{ theme: ThemeColors }>`
  color: ${p => p.theme.accentDanger};
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: -0.25rem;
`
