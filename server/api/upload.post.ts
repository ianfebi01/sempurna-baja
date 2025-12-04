// /server/api/upload.post.ts
import crypto from "node:crypto"

export default defineEventHandler( async ( event ) => {
    const form = await readMultipartFormData( event )
    const file = form?.find( ( f ) => f.name === "file" )
    const folder = "sempurna-baja"

    if ( !file ) {
        throw createError( { statusCode: 400, statusMessage: "Tidak ada file yang diunggah." } )
    }

    // ✅ Limit 2 MB for Vercel safety
    const maxBytes = 2 * 1024 * 1024
    if ( file.data.byteLength > maxBytes ) {
        throw createError( { statusCode: 413, statusMessage: "Ukuran file terlalu besar (maksimal 2 MB)." } )
    }

    // ✅ Validate image MIME
    if ( !file.type?.startsWith( "image/" ) ) {
        throw createError( { statusCode: 400, statusMessage: "Tipe file tidak valid, hanya gambar diperbolehkan." } )
    }

    // 🔐 Cloudinary config
    const cloudName = process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    const timestamp = Math.floor( Date.now() / 1000 )

    // ✅ Signature for Cloudinary
    const signature = crypto
        .createHash( "sha1" )
        .update( `folder=sempurna-baja&timestamp=${timestamp}${apiSecret}` )
        .digest( "hex" )


    // ✅ Use native FormData (no import)
    const body = new FormData()
    // 🟢 Convert Buffer → Blob (with MIME)
    body.append( "file", new Blob( [file.data], { type: file.type } ), file.filename )
    body.append( "api_key", apiKey )
    body.append( "timestamp", timestamp.toString() )
    body.append( "signature", signature )
    body.append( "folder", folder )


    console.log( { cloudName, apiKey, signature, timestamp } )


    // 🚀 Upload to Cloudinary
    const res = await $fetch<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body },
    )

    return { url: res.secure_url }
} )
