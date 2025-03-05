"use client";

import React, { useState, useEffect } from "react";
import GameCard from "../../components/GameCard";
import Game from "@/app/types/game";

const GamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/games");

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        const gamesData = await response.json();
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GamesPage;
