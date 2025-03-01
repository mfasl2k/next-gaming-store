"use client";
import React from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import AuthButton from "../AuthButton";
import Cart from "../cart/cart";

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-slate-300 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Green Gaming
          </Link>
        </div>
        <div className="flex-none gap-2">
          <AuthButton />
          <Cart />
        </div>
      </div>
    </header>
  );
};

export default Header;
