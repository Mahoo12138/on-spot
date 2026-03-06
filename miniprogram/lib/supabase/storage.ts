import { supabaseConfig } from './config'
import { supabaseClient, SupabaseResponse } from './client'

export interface FileObject {
  name: string
  id?: string
  updated_at?: string
  created_at?: string
  last_accessed_at?: string
  metadata?: Record<string, unknown>
}

export interface UploadResponse {
  Key: string
}

class SupabaseStorage {
  private get storageUrl() {
    return supabaseConfig.storageUrl
  }

  from(bucket: string) {
    return new StorageBucket(bucket)
  }

  getPublicUrl(bucket: string, path: string): string {
    return `${supabaseConfig.url}/storage/v1/object/public/${bucket}/${path}`
  }
}

class StorageBucket {
  private bucket: string

  constructor(bucket: string) {
    this.bucket = bucket
  }

  async upload(
    path: string,
    filePath: string,
    options?: {
      cacheControl?: string
      contentType?: string
      upsert?: boolean
    }
  ): Promise<SupabaseResponse<UploadResponse>> {
    return new Promise((resolve) => {
      wx.uploadFile({
        url: `${supabaseConfig.url}/storage/v1/object/${this.bucket}/${path}`,
        filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${supabaseClient.getAccessToken()}`,
          'x-upsert': options?.upsert ? 'true' : 'false',
        },
        formData: options?.cacheControl
          ? { cacheControl: options.cacheControl }
          : undefined,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(res.data) as UploadResponse
              resolve({
                data,
                error: null,
                status: res.statusCode,
              })
            } catch {
              resolve({
                data: { Key: `${this.bucket}/${path}` },
                error: null,
                status: res.statusCode,
              })
            }
          } else {
            resolve({
              data: null,
              error: {
                message: 'Upload failed',
                details: res.data,
              },
              status: res.statusCode,
            })
          }
        },
        fail: (err) => {
          resolve({
            data: null,
            error: {
              message: err.errMsg || 'Upload failed',
            },
            status: 0,
          })
        },
      })
    })
  }

  async download(path: string): Promise<SupabaseResponse<string>> {
    const url = `${supabaseConfig.url}/storage/v1/object/${this.bucket}/${path}`

    return new Promise((resolve) => {
      wx.downloadFile({
        url,
        header: {
          Authorization: `Bearer ${supabaseClient.getAccessToken()}`,
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              data: res.tempFilePath,
              error: null,
              status: res.statusCode,
            })
          } else {
            resolve({
              data: null,
              error: {
                message: 'Download failed',
              },
              status: res.statusCode,
            })
          }
        },
        fail: (err) => {
          resolve({
            data: null,
            error: {
              message: err.errMsg || 'Download failed',
            },
            status: 0,
          })
        },
      })
    })
  }

  async remove(paths: string[]): Promise<SupabaseResponse<FileObject[]>> {
    return supabaseClient.request<FileObject[]>(
      `${supabaseConfig.url}/storage/v1/object/${this.bucket}`,
      {
        method: 'DELETE',
        data: { prefixes: paths },
      }
    )
  }

  async list(
    path?: string,
    options?: {
      limit?: number
      offset?: number
      sortBy?: { column: string; order: 'asc' | 'desc' }
    }
  ): Promise<SupabaseResponse<FileObject[]>> {
    const query: Record<string, string | number | undefined> = {
      prefix: path || '',
      limit: options?.limit,
      offset: options?.offset,
    }

    if (options?.sortBy) {
      query.sortBy = `${options.sortBy.column}:${options.sortBy.order}`
    }

    return supabaseClient.get<FileObject[]>(
      `${supabaseConfig.url}/storage/v1/object/list/${this.bucket}`,
      query
    )
  }

  async move(fromPath: string, toPath: string): Promise<SupabaseResponse<FileObject>> {
    return supabaseClient.request<FileObject>(
      `${supabaseConfig.url}/storage/v1/object/move`,
      {
        method: 'POST',
        data: {
          bucketId: this.bucket,
          sourceKey: fromPath,
          destinationKey: toPath,
        },
      }
    )
  }

  async copy(fromPath: string, toPath: string): Promise<SupabaseResponse<FileObject>> {
    return supabaseClient.request<FileObject>(
      `${supabaseConfig.url}/storage/v1/object/copy`,
      {
        method: 'POST',
        data: {
          bucketId: this.bucket,
          sourceKey: fromPath,
          destinationKey: toPath,
        },
      }
    )
  }

  async createSignedUrl(
    path: string,
    expiresIn: number
  ): Promise<SupabaseResponse<{ signedURL: string }>> {
    return supabaseClient.post<{ signedURL: string }>(
      `${supabaseConfig.url}/storage/v1/object/sign/${this.bucket}/${path}`,
      { expiresIn }
    )
  }

  async createSignedUploadUrl(
    path: string
  ): Promise<SupabaseResponse<{ signedURL: string }>> {
    return supabaseClient.post<{ signedURL: string }>(
      `${supabaseConfig.url}/storage/v1/object/upload/sign/${this.bucket}/${path}`,
      {}
    )
  }

  getPublicUrl(path: string): string {
    return `${supabaseConfig.url}/storage/v1/object/public/${this.bucket}/${path}`
  }
}

export const supabaseStorage = new SupabaseStorage()
