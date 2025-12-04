import { defineApi, fail } from "~~/server/utils/api"

export default defineApi( async ( event ) => {
    // auth
    const me = await requireAuth( event )
    const email = me?.email
    const user = await UserSchema.findOne( { email } )
    if ( !user ) {
        fail( 401, "Unauthorized", "UNAUTHORIZED" )
    }

    // Get Id
    const id = event.context.params?.id
    if ( !id ) {
        return fail( 400, "Produk tidak valid", "BAD_REQUEST" )
    }

    // get product
    const product = await ProductSchema.findById( id ).populate( "brand" ).populate( "category" ).lean()

    if ( !product ) {
        return fail( 404, "Produk tidak ditemukan", "NOT_FOUND" )
    }

    return product
} )