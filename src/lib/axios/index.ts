import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const useApiClient = (): AxiosInstance => {
  const { auth } = useAuthStore()
  const token = auth.accessToken

  const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  })

  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // auth.reset()
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

export const useAuthApiClient = (): AxiosInstance => {
  const { auth } = useAuthStore()
  const token = auth.accessToken

  const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTH_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // auth.reset()
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}
