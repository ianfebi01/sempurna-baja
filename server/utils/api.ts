import type { H3Error} from "h3"
import { createError, setResponseStatus } from "h3"
import type { ZodError } from "zod"

export function baseMeta( event: any ) {
  const start = event.context.__start ?? performance.now()
  return {
    requestId  : event.context.requestId as string,
    method     : event.node.req.method || "",
    path       : event.node.req.url || "",
    durationMs : Math.round( performance.now() - start ),
    ts         : new Date().toISOString(),
  }
}

export function isZodError( e: any ): e is ZodError {
  return e?.issues && Array.isArray( e.issues )
}

export function normalizeError( e: unknown ) {
  // Default
  let statusCode = 500
  let code = "INTERNAL_ERROR"
  let message = "Something went wrong"
  let details: unknown = undefined

  // H3 error
  if ( e && typeof e === "object" && ( e as H3Error ).statusCode ) {
    const he = e as H3Error
    statusCode = he.statusCode ?? 500
    message = he.statusMessage || message
    code = ( he as any ).data?.code || code
    details = ( he as any ).data?.details
    return { statusCode, code, message, details }
  }

  // Zod
  if ( isZodError( e ) ) {
    statusCode = 400
    code = "VALIDATION_ERROR"
    message = e.issues?.[0]?.message || "Invalid payload"
    details = e.issues
    return { statusCode, code, message, details }
  }

  // Generic Error
  if ( e instanceof Error ) {
    message = e.message || message
  }

  return { statusCode, code, message, details }
}

/**
 * Bungkus handler agar output konsisten { success, data/error, meta }
 */
export function defineApi<T>(
  fn: ( event: any ) => Promise<T> | T,
) {
  return defineEventHandler( async ( event ) => {
    try {
      const data = await fn( event )
      // kalau handler memang ingin 204, boleh return null saja dan set status manual
      return {
        success : true,
        data,
        meta    : baseMeta( event ),
      }
    } catch ( err ) {
      const { statusCode, code, message, details } = normalizeError( err )
      setResponseStatus( event, statusCode )
      return {
        success : false,
        error   : { code, message, details },
        meta    : baseMeta( event ),
      }
    }
  } )
}

/** Helper lempar error dengan code/ details konsisten */
export function fail(
  statusCode: number,
  message: string,
  code = "ERROR",
  details?: unknown,
) {
  // createError tidak menerima object untuk statusMessage,
  // jadi info extra ditaruh di .data agar bisa diambil normalizeError
  throw createError( {
    statusCode,
    statusMessage : message,
    data          : { code, details },
  } )
}
