import React from "react";
import GameCard from "../../components/GameCard";
import { GameService } from "@/app/services/game-service";

const GamesPage = async () => {
  try {
    const games = await GameService.getAllGames();

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">
          Failed to load games. Please try again later.
        </p>
      </div>
    );
  }
};

export default GamesPage;
