import products from "../../app/assets/json/products.json"

/**
 * Fetch product slugs from MongoDB and return full prerender routes.
 */
export async function getProductRoutes(): Promise<string[]> {
    try {
        console.log( "Fetching product routes..." )
        return products.map( ( product ) => `/products/${product.slug}` )
    } catch ( err ) {
        console.warn( "[prerender] Unable to fetch product routes:", err )
        return []
    }
}
