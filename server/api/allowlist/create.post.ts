import clientPromise, { DB_NAME } from "~~/server/lib/mongodb"
import { ALLOWLIST_COLLECTION, RoleEnum } from "~~/server/models/allowlist.schema"
import z from "zod"

export default defineApi( async ( event ) => {
  await requireRole( event, "super-admin" )

  const client = await clientPromise
  if ( !client ) return fail( 500, "Koneksi database gagal", "INTERNAL_SERVER_ERROR" )
  const db = client.db( DB_NAME )

  const body = await readBody( event )
  const schema = z.object( {
    email : z.string().email( "Email tidak valid" ),
    role  : RoleEnum.default( "admin" ),
  } )
  const { email, role } = schema.parse( body )
  const emailNorm = email.trim().toLowerCase()

  await db.collection( ALLOWLIST_COLLECTION ).updateOne(
    { email: emailNorm },
    { $set: { email: emailNorm, role } },
    { upsert: true },
  )

  return { email: emailNorm, role }
} )
