export interface ApiMeta {
  requestId: string
  method: string
  path: string
  durationMs: number
  ts: string
}

type ApiSuccess<T> = {
  success: true
  data: T
  meta: ApiMeta
}

type ApiError = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: ApiMeta
}