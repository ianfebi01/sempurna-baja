import { defineApi, fail } from "~~/server/utils/api"
import z from "zod"

export default defineApi( async ( event ) => {
  // Require auth
  const me = await requireAuth( event )
  const email = me?.email
  if ( !email ) {
    return fail( 401, "Tidak diizinkan.", "UNAUTHORIZED" )
  }

  // Get Id
  const id = event.context.params?.id
  if ( !id ) {
    return fail( 400, "ID kategori tidak valid.", "BAD_REQUEST" )
  }

  // Parse body
  const body = await readBody( event )
  if ( !body ) {
    return fail( 400, "Data tidak valid.", "BAD_REQUEST" )
  }

  // Validate
  const schema = z.object( {
    name : z.string().min( 2, "Nama terlalu pendek" ),
    slug : z.string().min( 2, "Slug terlalu pendek" )
      .max( 100, "Slug maksimal 100 karakter" )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug hanya boleh huruf kecil, angka, dan tanda minus. Tidak boleh diawali/diakhiri dengan '-' atau ada '--'",
      ),
  } )
  const parsed = schema.safeParse( body )
  if ( !parsed.success ) {
    const first = parsed.error.issues[0]
    throw createError( { statusCode: 400, statusMessage: first.message } )
  }

  // Slug uniqueness
  const existing = await BrandSchema.findOne( { slug: parsed.data.slug } )
  if ( existing && String( existing.id ) !== id ) {
    return fail( 409, `Slug "${parsed.data.slug}" already exists.` )
  }

  // Save
  const brand = await BrandSchema.findByIdAndUpdate( id, {
    name : parsed.data.name,
    slug : parsed.data.slug,
  } )

  return {
    ...brand,
  }
} )
