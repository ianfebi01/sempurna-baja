import { defineApi } from "~~/server/utils/api"

export default defineApi( async ( _event ) => {
    // // auth
    // const me = await requireAuth( event )
    // const email = me?.email
    // const user = await UserSchema.findOne( { email } )
    // if ( !user ) {
    //     fail( 401, "Unauthorized", "UNAUTHORIZED" )
    // }

    // get categories
    const categories = await CategorySchema.find( )

    return categories
} )