import clientPromise, { DB_NAME } from "../lib/mongodb"

/**
 * Fetch product slugs from MongoDB and return full prerender routes.
 */
export async function getProductRoutes (): Promise<string[]> {
  try {
    const client = await clientPromise
    if ( !client ) return []

    const db = client.db( DB_NAME )
    const docs = await db
      .collection( "products" )
      .find( {}, { projection: { slug: 1 } } )
      .toArray()

    return docs
      .map( ( d ) => ( d as { slug?: string } )?.slug )
      .filter( ( s ): s is string => Boolean( s ) )
      .map( ( slug ) => `/products/${slug}` )
  } catch ( err ) {
    console.warn( "[prerender] Unable to fetch product routes:", err )
    return []
  }
}
