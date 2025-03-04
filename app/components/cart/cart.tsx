"use client";

import React from "react";
import { GrCart } from "react-icons/gr";
import Link from "next/link";
import { useCart } from "../../context/cart/cart-context";

const Cart = () => {
  const { cartItems, cartCount } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.game.price * item.quantity,
    0
  );

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <span className="badge badge-sm indicator-item">{cartCount}</span>
          <GrCart size="1.5rem" />
        </div>
      </div>

      {/* Right-aligned dropdown */}
      <div
        tabIndex={0}
        className="dropdown-content z-[1] menu p-0 shadow bg-base-100 rounded-box mt-3 w-72 sm:w-80 md:w-96 right-0"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{cartCount} Items</span>

          {cartItems.length > 0 ? (
            <>
              <div className="max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.game.id}
                    className="flex items-center gap-3 py-2 border-b"
                  >
                    <img
                      src={item.game.image}
                      alt={item.game.title}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.game.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        ${item.game.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm flex-shrink-0">
                      ${(item.game.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold mt-2">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="card-actions mt-4">
                <Link href="/cart" className="btn btn-primary btn-block">
                  View Cart
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center py-4">Your cart is empty</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
