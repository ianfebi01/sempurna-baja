import { defineMongooseModel } from "#nuxt/mongoose"

export const BrandSchema = defineMongooseModel( {
  name   : "Brand",
  schema : {
    name: {
      type     : "string",
      required : true,
      unique   : true,
      trim     : true,
      index    : true,
    },
    slug: {
      type      : "string",
      required  : true,
      unique    : true,
      lowercase : true,
      trim      : true,
      index     : true,
    },
  },
  options: {
    timestamps: true,
  },
  hooks( schema ) {
    // Optional: text search index
    schema.index( { name: "text", slug: "text" } )
  },
} )
