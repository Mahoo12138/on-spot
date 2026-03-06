export const supabaseConfig = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
  
  get apiUrl() {
    return `${this.url}/rest/v1`
  },
  
  get authUrl() {
    return `${this.url}/auth/v1`
  },
  
  get storageUrl() {
    return `${this.url}/storage/v1`
  },
}

export type SupabaseConfig = typeof supabaseConfig
