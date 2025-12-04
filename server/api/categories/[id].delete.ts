import { defineApi, fail } from "~~/server/utils/api"
import { CategorySchema } from "~~/server/models/category.schema"

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

  // Check if any product uses this category
  const usedByProduct = await ProductSchema.exists( { category: id } )
  if ( usedByProduct ) {
    return fail( 400, "Kategori sedang digunakan oleh produk lain", "CATEGORY_IN_USE" )
  }

  // Delete
  const category = await CategorySchema.findByIdAndDelete( id )
  if ( !category ) {
    return fail( 404, "Kategori tidak ditemukan", "NOT_FOUND" )
  }

  return {
    ...category,
  }
} )
