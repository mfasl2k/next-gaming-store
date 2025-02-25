import { z } from "zod";

const genreSchema = z.object({
  name: z.string().min(2),
});

const platformSchema = z.object({
  name: z.string().min(1),
});

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
  genres: z.array(z.object({ name: z.string().min(1) })).nonempty(),
  platforms: z.array(z.object({ name: z.string().min(1) })).nonempty(),
});

export { genreSchema, platformSchema, userSchema, gamesSchema };
