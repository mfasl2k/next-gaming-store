// app/api/games/route.ts (GET - Public, POST - Admin only)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";

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

async function updateGame(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const gameId = parseInt(id);

  try {
    const data = await request.json();

    const updatedGame = await prisma.games.update({
      where: { id: gameId },
      data,
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error(`Error updating game ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const PATCH = adminRoute(updateGame);

async function deleteGame(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const gameId = parseInt(id);

  try {
    await prisma.games.delete({
      where: { id: gameId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting game ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = adminRoute(deleteGame);
