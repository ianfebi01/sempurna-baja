import type { Product } from "#shared/types/product"
import productDatas from "@/assets/json/products.json"

const products: Product[] = productDatas

export default eventHandler( async () => {
  return products
} )
