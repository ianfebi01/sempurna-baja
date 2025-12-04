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
    return fail( 400, "Invalid category ID", "BAD_REQUEST" )
  }

  // Delete
  const brand = await BrandSchema.findByIdAndDelete( id )
  if ( !brand ) {
    return fail( 404, "Brand not found", "NOT_FOUND" )
  }

  return {
    ...brand,
  }
} )
