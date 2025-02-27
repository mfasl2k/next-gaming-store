"use client";
import React from "react";
import Cart from "./components/Cart";
import { VscAccount } from "react-icons/vsc";
import Link from "next/link";
import AuthButton from "./components/AuthButton";

const NavBar = () => {
  return (
    <div className="navbar bg-slate-300 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Green Gaming
        </Link>
      </div>
      <div className="flex-none gap-2">
        <Cart />
        <AuthButton />
      </div>
    </div>
  );
};

export default NavBar;
