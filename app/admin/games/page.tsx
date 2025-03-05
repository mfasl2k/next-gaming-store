"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiAlertCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import DataTable, { ColumnDefinition } from "@/app/components/admin/DataTable";
import Game from "@/app/types/game";
import { GameService } from "@/app/services/game-service";
import Image from "next/image";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/games");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Could not load games. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDeleteGame = async (game: Game) => {
    try {
      await GameService.deleteGame(game.id.toString());
      setGames(games.filter((g) => g.id !== game.id));
      toast.success(`"${game.title}" has been deleted`);
    } catch (err) {
      console.error("Error deleting game:", err);
      toast.error("Failed to delete game");
    }
  };

  const columns: ColumnDefinition<Game>[] = [
    {
      header: "Image",
      accessorKey: "image",
      cell: (game) => (
        <div className="avatar">
          <div className="w-12 h-12 rounded">
            <Image
              src={game.image}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/100x100?text=No+Image";
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (game) => `$${game.price.toFixed(2)}`,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (game) => (
        <div className="max-w-xs truncate">{game.description}</div>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (game) => new Date(game.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (game) => (
        <div className="flex space-x-2">
          <Link
            href={`/admin/games/edit/${game.id}`}
            className="btn btn-sm btn-ghost text-blue-600"
          >
            <FiEdit size={16} />
          </Link>
          <button
            onClick={() => handleDeleteGame(game)}
            className="btn btn-sm btn-ghost text-red-600"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        <Link href="/admin/games/new" className="btn btn-primary">
          <FiPlus className="mr-2" /> Add New Game
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable<Game>
          columns={columns}
          data={games}
          keyField="id"
          isLoading={isLoading}
          showActions={false}
        />
      </div>
    </div>
  );
}
