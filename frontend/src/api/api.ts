import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let onUnauthorized: (() => void) | null = null

export const setOnUnauthorized = (handler: () => void) => {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      if (onUnauthorized) onUnauthorized()
    }
    return Promise.reject(error)
  },
)