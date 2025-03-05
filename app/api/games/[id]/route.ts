import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getGameById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
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

async function updateGame(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
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
