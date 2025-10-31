import { createError, readMultipartFormData } from "h3"
import { Buffer } from "node:buffer"
import * as z from "zod"
import { defineApi, fail } from "~~/server/utils/api"

export default defineApi( async ( event ) => {
  // ---- constants
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  // ---- helpers
  const formatBytes = ( bytes: number, decimals = 2 ) => {
    if ( bytes === 0 ) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor( Math.log( bytes ) / Math.log( k ) )
    return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + " " + sizes[i]
  }

  // ---- read form
  const form = await readMultipartFormData( event )
  if ( !form ) {
    return fail( 400, "Invalid form data", "BAD_REQUEST" )
  }

  // ---- split parts into text + file
  const data: Record<string, string> = {}
  let imagePart: { filename?: string | null; type?: string | null; data: Uint8Array } | null = null

  for ( const part of form ) {
    if ( !part.name ) continue
    if ( part.name === "image" && part.filename && part.type ) {
      imagePart = { filename: part.filename, type: part.type, data: part.data || new Uint8Array() }
    } else {
      // MultiPartData doesn't have `.value`. Decode bytes:
      data[part.name] = part.data ? Buffer.from( part.data ).toString( "utf8" ) : ""
    }
  }

  // ---- auth
  const me = await requireAuth( event )
  const email = me?.email
  const user = await UserSchema.findOne( { email } )
  if ( !user ) {
    fail( 401, "Unauthorized", "UNAUTHORIZED" )
  }

  // ---- zod (text fields only)
  const textSchema = z.object( {
    name        : z.string().min( 2, "Nama terlalu pendek" ),
    slug        : z.string().min( 2, "Slug terlalu pendek" ).optional(), // we might auto-generate
    description : z.string().min( 10, "Deskripsi terlalu pendek" ),
    category    : z.string().min( 2, "Kategori terlalu pendek" ),
    price       : z.coerce.number().min( 1000, "Harga minimal adalah 1000" ),
    unit        : z.string().min( 1, "Satuan wajib diisi" ),
    brand       : z.string().min( 2, "Brand terlalu pendek" ),
  } )

  const parsed = textSchema.safeParse( data )
  if ( !parsed.success ) {
    const first = parsed.error.issues[0]
    throw createError( { statusCode: 400, statusMessage: first.message } )
  }

  // ---- slug: sanitize + uniqueness
  const slug = ( parsed.data.slug || parsed.data.name )
    .toLowerCase()
    .replace( /[^a-z0-9]+/g, "-" )
    .replace( /^-+|-+$/g, "" )

  const existing = await ProductSchema.findOne( { slug } )
  if ( existing ) {
    return fail( 409, `Slug "${slug}" already exists.` )
  }

  // ---- file validations (server-side)
  let imageUrl: string | null = null
  if ( imagePart ) {
    const mime = imagePart.type || ""
    const size = imagePart.data.length
    if ( !ACCEPTED_IMAGE_TYPES.includes( mime ) ) {
      return fail( 400, "Format gambar tidak valid. Format yang diperbolehkan: JPEG, PNG, atau WebP." )
    }
    if ( size > MAX_FILE_SIZE ) {
      return fail( 400, `Ukuran gambar terlalu besar. Maksimal ${formatBytes( MAX_FILE_SIZE )}.` )
    }

    const buf = Buffer.from( imagePart.data )

    // 🔹 pakai native FormData dari Node 18+ (Nitro sudah support)
    const formData = new FormData()
    if ( imagePart.filename )
    formData.append( "file", new Blob( [buf], { type: imagePart.type || "image/jpeg" } ), imagePart.filename )

    // 🔹 panggil endpoint upload internal (via fetch absolute URL)
    const baseUrl = process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await $fetch( `${baseUrl}/api/upload`, {
      method : "POST",
      body   : formData,
    } )

    if ( !res.url ) {
      console.error( res )
      fail( 500, "Upload gagal ke Cloudinary" )
    }

    imageUrl = res.url
  }

  // ---- save
  // const product = await new ProductSchema( {
  //   name        : parsed.data.name,
  //   slug,
  //   description : parsed.data.description,
  //   category    : parsed.data.category,
  //   price       : parsed.data.price,
  //   unit        : parsed.data.unit,
  //   brand       : parsed.data.brand,
  //   image       : imageUrl, // URL from storage
  // } ).save()

  // return product

  return {
    name        : parsed.data.name,
    slug,
    description : parsed.data.description,
    category    : parsed.data.category,
    price       : parsed.data.price,
    unit        : parsed.data.unit,
    brand       : parsed.data.brand,
    image       : imageUrl, // URL from storage

  }
} )