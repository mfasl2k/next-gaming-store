export default interface Game {
  id: number; // Unique identifier for the game
  name: string;
  description: string;
  price: number;
  rating: number;
  createdAt: Date;
  releaseAt: Date;
}
