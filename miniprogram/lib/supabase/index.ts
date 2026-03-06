export * from './config'
export * from './client'
export * from './auth'
export * from './database'
export * from './storage'

import { supabaseClient } from './client'
import { supabaseAuth } from './auth'
import { supabaseDatabase } from './database'
import { supabaseStorage } from './storage'

export const supabase = {
  auth: supabaseAuth,
  from: supabaseDatabase.from.bind(supabaseDatabase),
  rpc: supabaseDatabase.rpc.bind(supabaseDatabase),
  storage: supabaseStorage,
  client: supabaseClient,
}
