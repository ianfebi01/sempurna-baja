import bcrypt from "bcryptjs"
import z from "zod"
import clientPromise, { DB_NAME } from "~~/server/lib/mongodb"

const errorMessage = "Email atau password salah."

export default defineApi( async ( event ) => {
  const client = await clientPromise
  if ( !client ) {
    return fail( 500, "Koneksi database gagal" )
}
  const db = client.db( DB_NAME )

  const { email, password } = await readBody( event )

  const schema = z.object( {
    email    : z.email( "Email tidak valid" ),
    password : z.string( "Password tidak boleh kosong" ).min( 8, "Password harus terdiri dari minimal 8 karakter" ),
} )

  const result = schema.safeParse( { email, password } )

  if ( !result.success ) {
    const first = result.error.issues[0]
    throw createError( { statusCode: 400, statusMessage: first.message } )
  }

  const user = await db.collection( "users" ).findOne( { email } )

  if ( !user ) {
    return fail( 401, "Pengguna tidak ditemukan" )
  }

  const matches = await bcrypt.compare( password, user.password )

  if ( !matches ) {
    return fail( 401, errorMessage )
  }

  await setAuth( event, user.email )

  return {
    loggedIn : true,
    user     : user.email as string,
  }
} )
