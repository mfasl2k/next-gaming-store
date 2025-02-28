"use client";

import React, { useState } from "react";

import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Game from "../types/game";
import { useCart } from "../context/CartContex";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const { data: session, status } = useSession();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (status === "unauthenticated") {
      // Show a toast notification directing to use the auth button
      toast.error("Please sign in to add items to cart", {
        duration: 4000,
        icon: "🔑",
      });
      return;
    }

    // Make sure we have a user ID
    if (!session?.user?.id) {
      toast.error("User session error");
      return;
    }

    setLoading(true);
    try {
      // Update backend cart
      const userId = session.user.id;

      const res = await fetch(`/api/carts/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
          quantity: 1,
          userId: parseInt(userId),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Cart API error:", errorData);
        throw new Error("Failed to add game to cart");
      }

      // Update cart context
      await addToCart(game, 1);

      toast.success("Game added to cart! 🎮");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Error adding to cart ❌");
    } finally {
      setLoading(false);
    }
  };

  // Fallback image if the main image fails to load
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card card-compact bg-base-100 w-72 shadow-xl">
      <figure className="relative w-full h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={game.image}
            alt={game.title}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-lg font-semibold text-gray-500">
              {game.title}
            </span>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{game.title}</h2>
        <p className="line-clamp-2">{game.description}</p>
        <div className="badge badge-info badge-lg">${game.price}</div>
        <div className="card-actions justify-end">
          <button
            className="btn bg-green-500"
            onClick={handleAddToCart}
            disabled={loading || cartLoading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
