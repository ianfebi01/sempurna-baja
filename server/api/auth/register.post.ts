import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export default defineEventHandler( async ( event ) => {
  // TODO: use validation
  const { email, password, ...rest } = await readBody( event )

  const hashed = bcrypt.hashSync( password, 10 )

  try {
    const res = await mongoose.connection.db?.collection( "users" ).insertOne( { email, password: hashed, ...rest } )
    console.log( res )
  } catch ( error ) {
    console.log( error )
    throw createError( {
      statusMessage: "Pengguna sudah terdaftar.",
    } )
  }

  await setAuth( event, email )

  return {
    registered : true,
    user       : email as string,
  }
} )