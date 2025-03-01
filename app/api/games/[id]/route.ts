import { handleRequest } from "@/app/lib/apiHandler";
import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getGameById(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const gameId = parseInt(id);

  try {
    const game = await prisma.games.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = publicRoute(getGameById);
