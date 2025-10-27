import { defineMongooseModel } from "#nuxt/mongoose"

export const ProductSchema = defineMongooseModel<Product>( {
  name   : "Product",
  schema : {
    image: {
      type     : "string",
      required : true,
    },
    name: {
      type     : "string",
      required : true,
      trim     : true,
      index    : true, // simple field index
    },
    slug: {
      type      : "string",
      required  : true,
      unique    : true,
      lowercase : true,
      trim      : true,
      index     : true,
    },
    description: {
      type: "string",
    },
    category: {
      type     : "string",
      required : true,
      index    : true,
    },
    price: {
      type     : "number",
      required : true,
      min      : 0,
      index    : true,
    },
    unit: {
      type    : "string",
      default : "pcs",
    },
    brand: {
      type    : "string",
      default : "Generic",
      index   : true,
    },
  },
  options: {
    timestamps: true,
  },
  hooks( schema ) {
    // 🧩 compound indexes defined here
    schema.index( { category: 1, brand: 1 } )
    schema.index( { name: 1, price: 1 } )

    // Optional: text search index
    // schema.index({ name: 'text', description: 'text' })
  },
} )
