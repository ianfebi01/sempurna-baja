export type Product = {
  _id: ObjectId
  image: string
  name: string
  slug: string
  description: string
  category: ObjectId
  price: number
  unit: string
  brand: ObjectId
}

export type Category = {
  _id: ObjectId
  name: string
  slug: string
}
