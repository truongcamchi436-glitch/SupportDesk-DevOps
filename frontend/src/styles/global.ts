import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: #f4f6f9;
    color: #1a1a2e;
    min-height: 100vh;
  }

  button { cursor: pointer; }
`