import { supabaseConfig } from './config'

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  data?: unknown
  headers?: Record<string, string>
  query?: Record<string, string | number | boolean | undefined>
}

export interface SupabaseResponse<T> {
  data: T | null
  error: {
    message: string
    code?: string
    details?: string
  } | null
  status: number
}

const TOKEN_KEY = 'supabase_token'

class SupabaseClient {
  private accessToken: string | null = null

  constructor() {
    this.loadToken()
  }

  private loadToken() {
    try {
      const token = wx.getStorageSync(TOKEN_KEY)
      if (token) {
        this.accessToken = token
      }
    } catch (e) {
      console.error('Failed to load token:', e)
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
    if (token) {
      wx.setStorageSync(TOKEN_KEY, token)
    } else {
      wx.removeStorageSync(TOKEN_KEY)
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private buildQueryString(query?: Record<string, string | number | boolean | undefined>): string {
    if (!query) return ''
    const params = Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        const encodedKey = encodeURIComponent(key)
        const encodedValue = encodeURIComponent(String(value))
        return `${encodedKey}=${encodedValue}`
      })
    return params.length > 0 ? `?${params.join('&')}` : ''
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': supabaseConfig.anonKey,
      ...customHeaders,
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    return headers
  }

  async request<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<SupabaseResponse<T>> {
    const { method = 'GET', data, headers: customHeaders, query } = options

    const fullUrl = url + this.buildQueryString(query)
    const headers = this.getHeaders(customHeaders)

    return new Promise((resolve) => {
      wx.request({
        url: fullUrl,
        method,
        data,
        header: headers,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              data: res.data as T,
              error: null,
              status: res.statusCode,
            })
          } else {
            const errorData = res.data as { message?: string; error?: string; code?: string } | undefined
            resolve({
              data: null,
              error: {
                message: errorData?.message || errorData?.error || 'Request failed',
                code: errorData?.code,
                details: String(res.data),
              },
              status: res.statusCode,
            })
          }
        },
        fail: (err) => {
          resolve({
            data: null,
            error: {
              message: err.errMsg || 'Network error',
            },
            status: 0,
          })
        },
      })
    })
  }

  async get<T>(url: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(url, { method: 'GET', query })
  }

  async post<T>(url: string, data?: unknown) {
    return this.request<T>(url, { method: 'POST', data })
  }

  async patch<T>(url: string, data?: unknown) {
    return this.request<T>(url, { method: 'PATCH', data })
  }

  async put<T>(url: string, data?: unknown) {
    return this.request<T>(url, { method: 'PUT', data })
  }

  async delete<T>(url: string) {
    return this.request<T>(url, { method: 'DELETE' })
  }
}

export const supabaseClient = new SupabaseClient()
