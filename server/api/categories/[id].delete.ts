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
    return fail( 400, "Invalid category ID", "BAD_REQUEST" )
  }

  // Delete
  const category = await CategorySchema.findByIdAndDelete( id )
  if ( !category ) {
    return fail( 404, "Category not found", "NOT_FOUND" )
  }

  return {
    ...category,
  }
} )
