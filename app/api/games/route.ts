// app/api/games/route.ts (GET - Public, POST - Admin only)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAllGames(request: NextRequest) {
  try {
    const games = await prisma.games.findMany();
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = publicRoute(getAllGames);

async function createGame(request: NextRequest) {
  try {
    const data = await request.json();

    const newGame = await prisma.games.create({
      data,
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = adminRoute(createGame);
