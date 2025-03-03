"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import GameForm from "@/app/components/admin/GameForm";
import Game from "@/app/types/game";

export default function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = React.use(params); // Unwrap params with React.use()
  const gameId = parseInt(resolvedParams.id);

  useEffect(() => {
    const fetchGame = async () => {
      if (isNaN(gameId)) {
        setError("Invalid game ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch game");
        }

        const data = await response.json();
        setGame(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching game:", err);
        setError("Could not load game. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleSuccess = () => {
    router.push("/admin/games");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="space-y-6">
        <Link href="/admin/games" className="btn btn-outline btn-sm">
          <FiArrowLeft className="mr-2" /> Back to Games
        </Link>

        <div className="alert alert-error">
          <FiAlertCircle className="mr-2" />
          <span>{error || "Game not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Game: {game.title}</h1>
        <Link href="/admin/games" className="btn btn-outline btn-sm">
          <FiArrowLeft className="mr-2" /> Back to Games
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GameForm
          initialData={game}
          gameId={game.id}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
