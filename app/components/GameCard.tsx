"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Game from "../types/game";
import { useCart } from "../context/cart/cart-context";
import Link from "next/link";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const { data: session, status } = useSession();
  const { addItem, isInCart, isLoading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const gameInCart = isInCart(game.id);

  const handleAddToCart = async () => {
    if (gameInCart) {
      return;
    }

    if (status === "unauthenticated") {
      toast.error("Please sign in to add items to cart", {
        duration: 3000,
        icon: "🔑",
      });
      return;
    }

    if (!session?.user?.id) {
      toast.error("User session error");
      return;
    }

    setLoading(true);
    try {
      await addItem(game);
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {gameInCart ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-between items-center">
              <div className="badge badge-info badge-lg">In Cart</div>
              <Link href="/cart" className="btn btn-info btn-sm">
                View Cart
              </Link>
            </div>
          ) : (
            <button
              className="btn bg-green-500"
              onClick={handleAddToCart}
              disabled={loading || cartLoading}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
