import { defineApi, fail } from "~~/server/utils/api"
import { ProductSchema } from "~~/server/models/product.schema"

export default defineApi( async ( event ) => {
  // Require auth
  const me = await requireAuth( event )
  const email = me?.email
  if ( !email ) {
    return fail( 401, "Unauthorized", "UNAUTHORIZED" )
  }

  // Get Id
  const id = event.context.params?.id
  if ( !id ) {
    return fail( 400, "Kategori tidak valid", "BAD_REQUEST" )
  }

  // Check if any product uses this brand
  const usedByProduct = await ProductSchema.exists( { brand: id } )
  if ( usedByProduct ) {
    return fail( 400, "Brand sedang digunakan oleh produk lain", "BRAND_IN_USE" )
  }

  // Delete
  const brand = await BrandSchema.findByIdAndDelete( id )
  if ( !brand ) {
    return fail( 404, "Brand tidak ditemukan", "NOT_FOUND" )
  }

  return {
    ...brand,
  }
} )
