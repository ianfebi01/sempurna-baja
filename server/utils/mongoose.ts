import mongoose from "mongoose"

const uri = process.env.MONGODB_URI!
if ( !uri ) throw new Error( "MONGODB_URI is not defined" )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = ( global as any ).mongoose
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ( !cached ) cached = ( global as any ).mongoose = { conn: null, promise: null }

export async function connectDB() {
  if ( cached.conn ) return cached.conn
  if ( !cached.promise ) {
    cached.promise = mongoose.connect( uri, {
      serverSelectionTimeoutMS : 60000,
      socketTimeoutMS          : 60000,
      dbName                   : "sempurna-baja-dev",
    } )
  }
  cached.conn = await cached.promise
  return cached.conn
}
