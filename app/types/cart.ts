import Game from "./game";

export default interface Cart {
  id: number;
  userId: number;
  gameId: number;
  quantity: number;
  createdAt: Date;
  game?: Game;
}
