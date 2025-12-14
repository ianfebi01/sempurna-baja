import { defineApi, fail } from "~~/server/utils/api"

export default defineApi( async ( ) => {
    // get brands
    const brands = await BrandSchema.find( )

    if ( !brands ) {
        return fail( 500, "Gagal mengambil data brand.", "INTERNAL_SERVER_ERROR" )
    }

    return brands
} )