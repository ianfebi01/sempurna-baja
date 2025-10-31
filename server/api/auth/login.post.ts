import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const errorMessage = "Email atau password salah."

export default defineApi( async ( event ) => {
  // TODO: use validation
  const { email, password } = await readBody( event )

  if ( !email || !password ) {
    throw createError( {
      statusMessage: "required field",
    } )
  }

  const user = await mongoose.connection.db?.collection( "users" ).findOne( { email } )

  if ( !user ) {
    return fail( 401, errorMessage )
  }

  const matches = bcrypt.compareSync( password, user.password )

  if ( !matches ) {
    return fail( 401, errorMessage )
  }

  await setAuth( event, user.email )

  return {
    loggedIn : true,
    user     : user.email as string,
  }
} )
