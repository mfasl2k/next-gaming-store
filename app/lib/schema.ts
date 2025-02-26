import { z } from "zod";

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

export { userSchema, gamesSchema, cartSchema };
