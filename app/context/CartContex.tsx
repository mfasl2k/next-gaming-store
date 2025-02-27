"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import Game from "../types/game";

interface CartItem {
  game: Game;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (game: Game, quantity: number) => Promise<void>;
  removeFromCart: (gameId: number) => void;
  clearCart: () => void;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API when session changes or on first load
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        if (session?.user?.id) {
          // Fetch cart from database for logged-in users
          const response = await fetch(`/api/carts/${session.user.id}`);

          if (response.ok) {
            const cartData = await response.json();

            // Format the data from API to match our CartItem structure
            // This assumes your API returns cart items with game objects
            // Adjust the mapping based on your actual API response structure
            const formattedCartItems = cartData.map((item: any) => ({
              game: item.game,
              quantity: item.quantity,
            }));

            setCartItems(formattedCartItems);
            calculateCartCount(formattedCartItems);
          } else {
            // If API call fails, try fallback to localStorage
            console.error(
              "Failed to fetch cart from API, using local fallback"
            );
            const storedCart = localStorage.getItem(`cart-${session.user.id}`);
            if (storedCart) {
              const parsedCart = JSON.parse(storedCart);
              setCartItems(parsedCart);
              calculateCartCount(parsedCart);
            }
          }
        } else {
          // For guest users - use localStorage
          const guestCart = localStorage.getItem("guest-cart");
          if (guestCart) {
            const parsedCart = JSON.parse(guestCart);
            setCartItems(parsedCart);
            calculateCartCount(parsedCart);
          } else {
            setCartItems([]);
            setCartCount(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        // Clear the cart on error to prevent stale data
        setCartItems([]);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [session]);

  const calculateCartCount = (items: CartItem[]) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = async (game: Game, quantity: number) => {
    setIsLoading(true);
    try {
      // For logged-in users
      if (session?.user?.id) {
        // Update database first
        const res = await fetch(`/api/carts/${session.user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: game.id,
            quantity,
            userId: parseInt(session.user.id),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Cart API error:", errorData);
          throw new Error("Failed to update cart in database");
        }

        // After successfully updating the database, update local state
        const existingItemIndex = cartItems.findIndex(
          (item) => item.game.id === game.id
        );
        let updatedCartItems;

        if (existingItemIndex >= 0) {
          updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += quantity;
        } else {
          updatedCartItems = [...cartItems, { game, quantity }];
        }

        setCartItems(updatedCartItems);
        calculateCartCount(updatedCartItems);

        // Also save to localStorage as fallback
        localStorage.setItem(
          `cart-${session.user.id}`,
          JSON.stringify(updatedCartItems)
        );
      } else {
        // For guest users - only update localStorage
        const existingItemIndex = cartItems.findIndex(
          (item) => item.game.id === game.id
        );
        let updatedCartItems;

        if (existingItemIndex >= 0) {
          updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += quantity;
        } else {
          updatedCartItems = [...cartItems, { game, quantity }];
        }

        setCartItems(updatedCartItems);
        calculateCartCount(updatedCartItems);
        localStorage.setItem("guest-cart", JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (gameId: number) => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        // Remove from database first
        const res = await fetch(
          `/api/carts/${session.user.id}/items/${gameId}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) {
          console.error("Failed to remove item from database cart");
          throw new Error("Failed to remove item from cart");
        }
      }

      // Update local state
      const updatedCartItems = cartItems.filter(
        (item) => item.game.id !== gameId
      );
      setCartItems(updatedCartItems);
      calculateCartCount(updatedCartItems);

      // Update localStorage based on user status
      if (session?.user?.id) {
        localStorage.setItem(
          `cart-${session.user.id}`,
          JSON.stringify(updatedCartItems)
        );
      } else {
        localStorage.setItem("guest-cart", JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        // Clear cart in database
        const res = await fetch(`/api/carts/${session.user.id}/clear`, {
          method: "DELETE",
        });

        if (!res.ok) {
          console.error("Failed to clear cart in database");
          throw new Error("Failed to clear cart");
        }
      }

      // Clear local state
      setCartItems([]);
      setCartCount(0);

      // Clear localStorage based on user status
      if (session?.user?.id) {
        localStorage.removeItem(`cart-${session.user.id}`);
      } else {
        localStorage.removeItem("guest-cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
