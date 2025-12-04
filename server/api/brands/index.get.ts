import { defineApi, fail } from "~~/server/utils/api"

export default defineApi( async ( event ) => {
    // auth
    const me = await requireAuth( event )
    const email = me?.email
    const user = await UserSchema.findOne( { email } )
    if ( !user ) {
        fail( 401, "Unauthorized", "UNAUTHORIZED" )
    }

    // get brands
    const brands = await BrandSchema.find( )

    return brands
} )