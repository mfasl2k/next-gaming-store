import { handleRequest } from "@/app/lib/apiHandler";
import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const middlewareResponse = await publicRoute()(request);
  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

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

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const middlewareResponse = await adminRoute()(request);
  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const middlewareResponse = await adminRoute()(request);
  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

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
