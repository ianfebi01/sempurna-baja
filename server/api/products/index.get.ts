import { defineApi, fail } from "~~/server/utils/api"

export default defineApi( async ( event ) => {
    // auth
    const me = await requireAuth( event )
    const email = me?.email
    const user = await UserSchema.findOne( { email } )
    if ( !user ) {
        fail( 401, "Unauthorized", "UNAUTHORIZED" )
    }

    // Query params
    const query = getQuery( event )
    const page = parseInt( query.page as string ) || 1
    const pageSize = parseInt( query.pageSize as string ) || 10
    const search = ( query.search as string ) || ""
    const category = ( query.category as string ) || ""
    const sortBy = ( query.sortBy as string ) || "createdAt"
    const sortOrder = ( query.sortOrder as string ) === "desc" ? -1 : 1

    // Build filter
    const filter: Record<string, unknown> = {}
    if ( search ) {
        filter.name = { $regex: search, $options: "i" }
    }
    if ( category && category !== "all" ) {
        filter["category"] = category
    }

    // Count total
    const total = await ProductSchema.countDocuments( filter )

    // Find products
    const products = await ProductSchema.find( filter )
        .populate( "brand" )
        .populate( "category" )
        .sort( { [sortBy]: sortOrder } )
        .skip( ( page - 1 ) * pageSize )
        .limit( pageSize )
        .lean()

    return {
        data : products,
        meta : {
            page       : page,
            pageSize   : pageSize,
            total      : total,
            totalPages : Math.ceil( total / pageSize ),
        },
    }
} )