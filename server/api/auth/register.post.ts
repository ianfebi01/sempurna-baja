import bcrypt from "bcryptjs"
import clientPromise, { DB_NAME } from "~~/server/lib/mongodb"

export default defineEventHandler( async ( event ) => {
  // Connect DB
  const client = await clientPromise

  if ( !client ) {
    return fail( 500, "Koneksi database gagal" )
  }

  const db = client.db( DB_NAME )
  
  // TODO: use validation
  const { email, password, ...rest } = await readBody( event )

  const hashed = bcrypt.hashSync( password, 10 )

  try {
    const res = await db.collection( "users" ).insertOne( { email, password: hashed, ...rest } )
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