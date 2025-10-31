import type { JWTPayload } from "jose"

export interface AuthPayload extends JWTPayload {
  email?: string
}

type ApiSuccess<T> = {
  success: true
  data: T
  meta: {
    requestId: string
    method: string
    path: string
    durationMs: number
    ts: string
  }
}

type ApiError = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: {
    requestId: string
    method: string
    path: string
    durationMs: number
    ts: string
  }
}
