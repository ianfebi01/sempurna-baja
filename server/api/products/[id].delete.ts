import { defineApi, fail } from "~~/server/utils/api"

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
    return fail( 400, "Produk tidak valid", "BAD_REQUEST" )
  }

  // Delete
  const product = await ProductSchema.findByIdAndDelete( id )
  if ( !product ) {
    return fail( 404, "Produk tidak ditemukan", "NOT_FOUND" )
  }

  return {
    ...product,
  }
} )
