"use client";
import React, { useState } from "react";
import Game from "../types/game";
import toast from "react-hot-toast";
interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/carts/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
          quantity: 1,
          userId: 1, // Hardcoded user ID for now
        }),
      });

      if (!res.ok) throw new Error("Failed to add game to cart");

      toast.success("Game added to cart! 🎮");
    } catch (error) {
      toast.error("Error adding to cart ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-compact bg-base-100 w-96 shadow-xl">
      <figure>
        <img src={game.image} alt={game.title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{game.title}</h2>
        <p>{game.description}</p>
        <div className="card-actions justify-end">
          <button className="btn bg-green-500" onClick={handleAddToCart}>
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
