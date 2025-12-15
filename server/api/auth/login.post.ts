import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import z from "zod"
import { connectDB } from "~~/server/utils/mongoose"

const errorMessage = "Email atau password salah."

export default defineApi( async ( event ) => {
  await connectDB()

  const { email, password } = await readBody( event )

  const schema = z.object( {
    email    : z.string().email( "Email tidak valid" ),
    password : z.string( "Password tidak boleh kosong" ).min( 8, "Password harus terdiri dari minimal 8 karakter" ),
} )

  const result = schema.safeParse( { email, password } )

  if ( !result.success ) {
    const first = result.error.issues[0]
    throw createError( { statusCode: 400, statusMessage: first.message } )
  }

  if ( !mongoose.connection.db ) {
    fail( 500, "Database connection not established" )
  }

  const user = await mongoose.connection.db?.collection( "users" ).findOne( { email } )

  if ( !user ) {
    return fail( 401, errorMessage )
  }

  const matches = await bcrypt.compare( password, user.password )

  console.log( "matches: ", matches )

  if ( !matches ) {
    return fail( 401, errorMessage )
  }

  // Clear any existing session/token before setting a new one
  await clearAuth( event )
  await setAuth( event, user.email )

  return {
    loggedIn : true,
    user     : user.email as string,
  }
} )
