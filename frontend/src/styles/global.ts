import { createGlobalStyle } from 'styled-components'

export interface ThemeColors {
  // backgrounds
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgCard: string
  bgCardHover: string
  bgInput: string
  bgSidebar: string
  bgOverlay: string

  // text
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string

  // brand
  brandPrimary: string
  brandPrimaryHover: string
  brandPrimaryLight: string
  brandGradient: string

  // accents
  accentSuccess: string
  accentSuccessLight: string
  accentWarning: string
  accentWarningLight: string
  accentDanger: string
  accentDangerLight: string
  accentInfo: string
  accentInfoLight: string

  // borders
  border: string
  borderLight: string
  borderFocus: string

  // shadows
  shadowSm: string
  shadowMd: string
  shadowLg: string
  shadowGlow: string
}

export const lightTheme: ThemeColors = {
  bgPrimary: '#f8f9fc',
  bgSecondary: '#ffffff',
  bgTertiary: '#f1f3f9',
  bgCard: '#ffffff',
  bgCardHover: '#f8f9fc',
  bgInput: '#f4f5f9',
  bgSidebar: '#0f172a',
  bgOverlay: 'rgba(15, 23, 42, 0.5)',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textInverse: '#f8fafc',

  brandPrimary: '#6366f1',
  brandPrimaryHover: '#4f46e5',
  brandPrimaryLight: 'rgba(99, 102, 241, 0.1)',
  brandGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',

  accentSuccess: '#10b981',
  accentSuccessLight: 'rgba(16, 185, 129, 0.1)',
  accentWarning: '#f59e0b',
  accentWarningLight: 'rgba(245, 158, 11, 0.1)',
  accentDanger: '#ef4444',
  accentDangerLight: 'rgba(239, 68, 68, 0.1)',
  accentInfo: '#3b82f6',
  accentInfoLight: 'rgba(59, 130, 246, 0.1)',

  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderFocus: '#6366f1',

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.04)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.08)',
  shadowGlow: '0 0 20px rgba(99, 102, 241, 0.15)',
}

export const darkTheme: ThemeColors = {
  bgPrimary: '#0b0f1a',
  bgSecondary: '#111827',
  bgTertiary: '#1e293b',
  bgCard: '#1e293b',
  bgCardHover: '#263148',
  bgInput: '#1e293b',
  bgSidebar: '#0b0f1a',
  bgOverlay: 'rgba(0, 0, 0, 0.6)',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textInverse: '#0f172a',

  brandPrimary: '#818cf8',
  brandPrimaryHover: '#6366f1',
  brandPrimaryLight: 'rgba(129, 140, 248, 0.12)',
  brandGradient: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',

  accentSuccess: '#34d399',
  accentSuccessLight: 'rgba(52, 211, 153, 0.12)',
  accentWarning: '#fbbf24',
  accentWarningLight: 'rgba(251, 191, 36, 0.12)',
  accentDanger: '#f87171',
  accentDangerLight: 'rgba(248, 113, 113, 0.12)',
  accentInfo: '#60a5fa',
  accentInfoLight: 'rgba(96, 165, 250, 0.12)',

  border: '#1e293b',
  borderLight: '#334155',
  borderFocus: '#818cf8',

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.2)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.3)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.4)',
  shadowGlow: '0 0 20px rgba(129, 140, 248, 0.2)',
}

export const GlobalStyle = createGlobalStyle<{ theme?: ThemeColors }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: ${p => p.theme.bgPrimary};
    color: ${p => p.theme.textPrimary};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.3s ease, color 0.3s ease;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${p => p.theme.textMuted};
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${p => p.theme.textSecondary};
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(16px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`