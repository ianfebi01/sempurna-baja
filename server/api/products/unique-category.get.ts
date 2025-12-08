import { defineApi } from "~~/server/utils/api"
import { ProductSchema } from "~~/server/models/product.schema"

export default defineApi( async event => {
  // Get slug from query params
  const query = getQuery( event )
  const slug = ( query.slug as string ) || ""

  // Use aggregation to get up to 3 products from unique categories, excluding the given slug
  const pipeline = [
    ...( slug ? [{ $match: { slug: { $ne: slug } } }] : [] ),
    {
      $sort: { createdAt: -1 as -1 }, // Mongoose expects 1 or -1
    },
    {
      $group: {
        _id     : "$category",
        product : { $first: "$$ROOT" },
      },
    },
    { $limit: 3 },
    {
      $replaceRoot: { newRoot: "$product" },
    },
  ]

  let products = await ProductSchema.aggregate( pipeline )

  // Populate brand and category manually since aggregate doesn't auto-populate
  products = await ProductSchema.populate( products, [
    { path: "brand" },
    { path: "category" },
  ] )

  return {
    data : products,
    meta : {
      total: products.length,
    },
  }
} )
