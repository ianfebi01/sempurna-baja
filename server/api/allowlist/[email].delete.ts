import clientPromise, { DB_NAME } from "~~/server/lib/mongodb"
import { ALLOWLIST_COLLECTION } from "~~/server/models/allowlist.schema"

export default defineApi( async ( event ) => {
  await requireRole( event, "super-admin" )

  const email = event.context.params?.email
  if ( !email ) return fail( 400, "Email tidak valid", "BAD_REQUEST" )
  const emailNorm = String( email ).trim().toLowerCase()

  const client = await clientPromise
  if ( !client ) return fail( 500, "Koneksi database gagal", "INTERNAL_SERVER_ERROR" )
  const db = client.db( DB_NAME )

  await db.collection( ALLOWLIST_COLLECTION ).deleteOne( { email: emailNorm } )
  return { deleted: true }
} )
