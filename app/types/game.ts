export default interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  createdAt: Date;
  releaseDate: Date;
}
