import z from "zod"

// Zod schema for user validation
export const UserZod = z.object( {
  email    : z.string().email( "Email tidak valid" ),
  password : z.string().min( 8, "Password harus terdiri dari minimal 8 karakter" ),
} )

export type UserInput = z.infer<typeof UserZod>

// Mongo collection name helper
export const USER_COLLECTION = "users"
