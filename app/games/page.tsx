import React, { useState } from "react";
import Game from "../types/game";
import GameCard from "../components/GameCard";

const GamesPage = async () => {
  const data = await fetch("http://localhost:3000/api/games", {
    cache: "no-store",
  });
  const games: Game[] = await data.json();
  const sortedGames = games.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="flex flex-shrink-0 flex-wrap gap-4">
      {sortedGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GamesPage;
