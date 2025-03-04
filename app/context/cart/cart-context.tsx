"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Game from "@/app/types/game";

interface CartItem {
  id?: number;
  game: Game;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  isInCart: (gameId: number) => boolean;
  addItem: (game: Game) => Promise<void>;
  removeItem: (gameId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const cartCount = cartItems.length;

  const isInCart = (gameId: number) => {
    return cartItems.some((item) => item.game.id === gameId);
  };

  useEffect(() => {
    async function fetchCart() {
      if (status === "authenticated" && session?.user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/carts/${session.user.id}`);

          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          } else {
            console.error("Failed to fetch cart:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
          }
        }
      }
    }

    fetchCart();
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, status]);

  const addItem = async (game: Game) => {
    if (isInCart(game.id)) {
      toast.success(`${game.title} is already in your cart`);
      return;
    }

    setIsLoading(true);

    try {
      if (status === "authenticated" && session?.user?.id) {
        const response = await fetch(`/api/carts/${session.user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add game to cart");
        }

        const updatedCartResponse = await fetch(
          `/api/carts/${session.user.id}`
        );
        if (updatedCartResponse.ok) {
          const updatedCart = await updatedCartResponse.json();
          setCartItems(updatedCart);
        }
      } else if (status === "unauthenticated") {
        setCartItems((prevItems) => [...prevItems, { game, quantity: 1 }]);
      } else {
        router.push("/login");
        return;
      }

      toast.success(`Added ${game.title} to cart`);
    } catch (error) {
      console.error("Error adding game to cart:", error);
      toast.error("Failed to add game to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (gameId: number) => {
    setIsLoading(true);

    try {
      if (status === "authenticated" && session?.user?.id) {
        const response = await fetch(
          `/api/carts/${session.user.id}/items/${gameId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove game from cart");
        }

        setCartItems((prevItems) =>
          prevItems.filter((item) => item.game.id !== gameId)
        );
      } else if (status === "unauthenticated") {
        const itemToRemove = cartItems.find((item) => item.game.id === gameId);

        setCartItems((prevItems) =>
          prevItems.filter((item) => item.game.id !== gameId)
        );

        if (itemToRemove) {
          toast.success(`Removed ${itemToRemove.game.title} from cart`);
        }
      } else {
        router.push("/login");
        return;
      }
    } catch (error) {
      console.error("Error removing game from cart:", error);
      toast.error("Failed to remove game from cart");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);

    try {
      if (status === "authenticated" && session?.user?.id) {
        const response = await fetch(`/api/carts/${session.user.id}/clear`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to clear cart");
        }
      }

      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    isLoading,
    isInCart,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
