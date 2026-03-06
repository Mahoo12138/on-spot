import { supabaseConfig } from './config'
import { supabaseClient, SupabaseResponse } from './client'

export interface User {
  id: string
  email?: string
  phone?: string
  created_at: string
  last_sign_in_at?: string
  role?: string
  aud: string
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}

export interface AuthError {
  message: string
  code?: string
}

class SupabaseAuth {
  private get authUrl() {
    return supabaseConfig.authUrl
  }

  async signUpWithEmail(email: string, password: string): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(`${this.authUrl}/signup`, {
      method: 'POST',
      data: { email, password },
    })

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async signInWithEmail(email: string, password: string): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(
      `${this.authUrl}/token?grant_type=password`,
      {
        method: 'POST',
        data: { email, password },
      }
    )

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async signInWithPhone(phone: string, password: string): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(
      `${this.authUrl}/token?grant_type=password`,
      {
        method: 'POST',
        data: { phone, password },
      }
    )

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async sendOtp(phone: string): Promise<SupabaseResponse<{}>> {
    return supabaseClient.request<{}>(`${this.authUrl}/otp`, {
      method: 'POST',
      data: { phone },
    })
  }

  async verifyOtp(phone: string, token: string, type: 'sms' | 'phone_change' = 'sms'): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(`${this.authUrl}/verify`, {
      method: 'POST',
      data: { phone, token, type },
    })

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async signInWithWechat(code: string): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(`${this.authUrl}/token?grant_type=wechat`, {
      method: 'POST',
      data: { code },
    })

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async getSession(): Promise<SupabaseResponse<Session>> {
    const token = supabaseClient.getAccessToken()
    if (!token) {
      return {
        data: null,
        error: { message: 'No session found' },
        status: 401,
      }
    }

    return supabaseClient.request<Session>(`${this.authUrl}/user`, {
      method: 'GET',
    })
  }

  async getUser(): Promise<SupabaseResponse<User>> {
    return supabaseClient.request<User>(`${this.authUrl}/user`, {
      method: 'GET',
    })
  }

  async refreshSession(refreshToken: string): Promise<SupabaseResponse<Session>> {
    const response = await supabaseClient.request<Session>(
      `${this.authUrl}/token?grant_type=refresh_token`,
      {
        method: 'POST',
        data: { refresh_token: refreshToken },
      }
    )

    if (response.data) {
      supabaseClient.setAccessToken(response.data.access_token)
    }

    return response
  }

  async signOut(): Promise<SupabaseResponse<{}>> {
    const response = await supabaseClient.request<{}>(`${this.authUrl}/logout`, {
      method: 'POST',
    })

    supabaseClient.setAccessToken(null)
    return response
  }

  async updatePassword(newPassword: string): Promise<SupabaseResponse<User>> {
    return supabaseClient.request<User>(`${this.authUrl}/user`, {
      method: 'PUT',
      data: { password: newPassword },
    })
  }

  async updateUser(attributes: Record<string, unknown>): Promise<SupabaseResponse<User>> {
    return supabaseClient.request<User>(`${this.authUrl}/user`, {
      method: 'PUT',
      data: attributes,
    })
  }

  isAuthenticated(): boolean {
    return !!supabaseClient.getAccessToken()
  }
}

export const supabaseAuth = new SupabaseAuth()
