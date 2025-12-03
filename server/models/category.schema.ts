import { defineMongooseModel } from "#nuxt/mongoose"
import type { Category } from "~~/shared/types/product"

export const CategorySchema = defineMongooseModel<Category>( {
  name   : "Category",
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
