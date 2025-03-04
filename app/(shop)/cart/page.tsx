"use client";

import React from "react";
import { useCart } from "../../context/cart/cart-context";
import Link from "next/link";
import { FiArrowLeft, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import Image from "next/image";

const CartPage = () => {
  const { cartItems, cartCount, clearCart, removeItem, isLoading } = useCart();

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.game.price,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-base-100 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiShoppingCart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any games to your cart yet.
          </p>
          <Link href="/games" className="btn btn-primary">
            <FiArrowLeft className="mr-2" /> Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Your Cart ({cartCount} {cartCount === 1 ? "game" : "games"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.game.id}
              className="flex flex-col sm:flex-row bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 rounded-lg overflow-hidden"
            >
              {/* Image container with fixed aspect ratio */}
              <div className="sm:w-32 h-32 flex-shrink-0">
                <div className="w-full h-full relative">
                  <Image
                    src={item.game.image}
                    alt={item.game.title}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                  />
                </div>
              </div>

              {/* Content area with flexible width */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.game.title}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.game.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => removeItem(item.game.id)}
                    className="btn btn-sm btn-error btn-outline"
                    disabled={isLoading}
                  >
                    <FiTrash2 size={16} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
            <Link href="/games" className="btn btn-outline">
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>

            <button
              onClick={clearCart}
              className="btn btn-outline btn-error"
              disabled={isLoading}
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-base-100 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-block" disabled={isLoading}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
