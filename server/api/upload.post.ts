import crypto from "node:crypto"

export default defineEventHandler( async ( event ) => {
    const form = await readMultipartFormData( event )
    const file = form?.find( ( f ) => f.name === "file" )
    const folder = "sempurna-baja"

    if ( !file ) {
        throw createError( { statusCode: 400, statusMessage: "Tidak ada file yang diunggah." } )
    }

    const maxBytes = 2 * 1024 * 1024
    if ( file.data.byteLength > maxBytes ) {
        throw createError( { statusCode: 413, statusMessage: "Ukuran file terlalu besar (maksimal 2 MB)." } )
    }

    if ( !file.type?.startsWith( "image/" ) ) {
        throw createError( { statusCode: 400, statusMessage: "Tipe file tidak valid, hanya gambar diperbolehkan." } )
    }

    const cloudName = process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if ( !cloudName || !apiKey || !apiSecret ) {
        throw createError( {
            statusCode    : 500,
            statusMessage : "Konfigurasi Cloudinary tidak ditemukan di environment (CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET/NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME).",
        } )
    }

    const timestamp = Math.floor( Date.now() / 1000 )

    const signature = crypto
        .createHash( "sha1" )
        .update( `folder=${folder}&timestamp=${timestamp}${apiSecret}` )
        .digest( "hex" )

    const body = new FormData()
    body.append( "file", new Blob( [file.data], { type: file.type } ), file.filename )
    body.append( "api_key", apiKey )
    body.append( "timestamp", timestamp.toString() )
    body.append( "signature", signature )
    body.append( "folder", folder )

    try {
        const res = await $fetch<{ secure_url: string }>(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body },
        )
        return { url: res.secure_url }
    } catch ( err: unknown ) {
        let message = "Upload gagal"
        let statusCode = 500
        if ( err && typeof err === "object" ) {
            const e = err as { statusCode?: number; data?: { message?: string } }
            statusCode = e.statusCode ?? 500
            message = e.data?.message || message
        } else if ( err instanceof Error ) {
            message = err.message || message
        }
        if ( statusCode === 401 || /Unauthorized/i.test( message ) ) {
            throw createError( { statusCode: 401, statusMessage: "Cloudinary Unauthorized: periksa CLOUDINARY_API_KEY/SECRET dan Cloud Name." } )
        }
        throw createError( { statusCode, statusMessage: message } )
    }
} )
