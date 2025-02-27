import { string, z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const gamesSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  image: z.string().url(),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  releaseDate: z.string(),
});

const cartSchema = z.object({
  userId: z.number(),
  gameId: z.number(),
  quantity: z.number().positive(),
});

const signInSchema = z.object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export { userSchema, gamesSchema, cartSchema, signInSchema };
