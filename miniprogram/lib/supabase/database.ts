import { supabaseConfig } from './config'
import { supabaseClient, SupabaseResponse } from './client'

export type OrderDirection = 'asc' | 'desc'

export interface QueryOptions {
  select?: string
  filter?: Record<string, unknown>
  order?: { column: string; ascending?: boolean }
  limit?: number
  offset?: number
  single?: boolean
}

class SupabaseDatabase {
  private get apiUrl() {
    return supabaseConfig.apiUrl
  }

  from<T extends Record<string, unknown>>(table: string) {
    return new QueryBuilder<T>(table)
  }

  rpc<T>(fn: string, params?: Record<string, unknown>): Promise<SupabaseResponse<T>> {
    return supabaseClient.post<T>(`${this.apiUrl}/rpc/${fn}`, params)
  }
}

class QueryBuilder<T extends Record<string, unknown>> {
  private table: string
  private queryOptions: QueryOptions = {}
  private filters: string[] = []
  private orders: string[] = []
  private limitCount?: number
  private offsetCount?: number
  private selectColumns?: string
  private isSingle = false

  constructor(table: string) {
    this.table = table
  }

  select(columns?: string): this {
    this.selectColumns = columns || '*'
    return this
  }

  eq(column: string, value: unknown): this {
    this.filters.push(`${column}=eq.${value}`)
    return this
  }

  neq(column: string, value: unknown): this {
    this.filters.push(`${column}=neq.${value}`)
    return this
  }

  gt(column: string, value: unknown): this {
    this.filters.push(`${column}=gt.${value}`)
    return this
  }

  gte(column: string, value: unknown): this {
    this.filters.push(`${column}=gte.${value}`)
    return this
  }

  lt(column: string, value: unknown): this {
    this.filters.push(`${column}=lt.${value}`)
    return this
  }

  lte(column: string, value: unknown): this {
    this.filters.push(`${column}=lte.${value}`)
    return this
  }

  like(column: string, pattern: string): this {
    this.filters.push(`${column}=like.${pattern}`)
    return this
  }

  ilike(column: string, pattern: string): this {
    this.filters.push(`${column}=ilike.${pattern}`)
    return this
  }

  in(column: string, values: unknown[]): this {
    this.filters.push(`${column}=in.(${values.join(',')})`)
    return this
  }

  isNull(column: string): this {
    this.filters.push(`${column}=is.null`)
    return this
  }

  isNotNull(column: string): this {
    this.filters.push(`${column}=not.is.null`)
    return this
  }

  or(conditions: string): this {
    this.filters.push(`or=(${conditions})`)
    return this
  }

  and(conditions: string): this {
    this.filters.push(`and=(${conditions})`)
    return this
  }

  range(column: string, from: unknown, to: unknown): this {
    this.filters.push(`${column}=gte.${from}&${column}=lte.${to}`)
    return this
  }

  order(column: string, ascending = true): this {
    this.orders.push(`${column}.${ascending ? 'asc' : 'desc'}`)
    return this
  }

  limit(count: number): this {
    this.limitCount = count
    return this
  }

  offset(count: number): this {
    this.offsetCount = count
    return this
  }

  single(): this {
    this.isSingle = true
    return this
  }

  private buildQuery(): Record<string, string> {
    const query: Record<string, string> = {}

    if (this.selectColumns) {
      query['select'] = this.selectColumns
    }

    this.filters.forEach((filter, index) => {
      const [key, value] = filter.split('=')
      if (index === 0) {
        query[key] = value
      } else {
        const existingKey = Object.keys(query).find((k) => k === key)
        if (existingKey) {
          query[`${key}`] = `${query[key]},${value}`
        } else {
          query[key] = value
        }
      }
    })

    if (this.orders.length > 0) {
      query['order'] = this.orders.join(',')
    }

    if (this.limitCount !== undefined) {
      query['limit'] = String(this.limitCount)
    }

    if (this.offsetCount !== undefined) {
      query['offset'] = String(this.offsetCount)
    }

    return query
  }

  async execute(): Promise<SupabaseResponse<T[]>> {
    const url = `${supabaseConfig.apiUrl}/${this.table}`
    const query = this.buildQuery()
    const headers: Record<string, string> = {}

    if (this.isSingle) {
      headers['Accept'] = 'application/vnd.pgrst.object+json'
    }

    return supabaseClient.get<T[]>(url, query)
  }

  async insert(data: T | T[]): Promise<SupabaseResponse<T[]>> {
    const url = `${supabaseConfig.apiUrl}/${this.table}`
    const headers: Record<string, string> = {
      'Prefer': 'return=representation',
    }
    return supabaseClient.request<T[]>(url, {
      method: 'POST',
      data,
      headers,
    })
  }

  async update(data: Partial<T>): Promise<SupabaseResponse<T[]>> {
    const url = `${supabaseConfig.apiUrl}/${this.table}`
    const query = this.buildQuery()
    const headers: Record<string, string> = {
      'Prefer': 'return=representation',
    }
    return supabaseClient.request<T[]>(url, {
      method: 'PATCH',
      data,
      query,
      headers,
    })
  }

  async delete(): Promise<SupabaseResponse<T[]>> {
    const url = `${supabaseConfig.apiUrl}/${this.table}`
    const query = this.buildQuery()
    const headers: Record<string, string> = {
      'Prefer': 'return=representation',
    }
    return supabaseClient.request<T[]>(url, {
      method: 'DELETE',
      query,
      headers,
    })
  }

  async count(): Promise<SupabaseResponse<number>> {
    const url = `${supabaseConfig.apiUrl}/${this.table}`
    const query = this.buildQuery()
    const headers: Record<string, string> = {
      'Prefer': 'count=exact',
    }

    const response = await supabaseClient.request<T[]>(url, {
      method: 'GET',
      query,
      headers,
    })

    return {
      data: response.data?.length ?? 0,
      error: response.error,
      status: response.status,
    }
  }
}

export const supabaseDatabase = new SupabaseDatabase()
