import { api } from './api'

export interface AuthResponse {
  token: string
  user: {
    name: string
    role: 'client' | 'agent'
    email: string
  }
}

export const loginApi = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password })

export const registerApi = (
  name: string,
  email: string,
  password: string,
  role: 'client' | 'agent',
) => api.post<AuthResponse>('/auth/register', { name, email, password, role })