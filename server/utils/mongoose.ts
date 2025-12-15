import mongoose from "mongoose"

const uri = process.env.MONGODB_URI!
let isConnected = false

export async function connectDB() {
    console.log( "MONGODB_URI:", process.env.MONGODB_URI )

    if ( isConnected ) return
    await mongoose.connect( uri )
    isConnected = true
}
