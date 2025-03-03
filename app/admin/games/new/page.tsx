"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GameForm from "@/app/components/admin/GameForm";

export default function NewGamePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/games");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Game</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GameForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
