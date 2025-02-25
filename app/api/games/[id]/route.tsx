import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = Number(params.id);

  if (isNaN(gameId)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  const game = await prisma.games.findUnique({
    where: { id: gameId },
    include: {
      genres: { include: { genre: true } },
      platforms: { include: { platform: true } },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = Number(params.id);
  if (isNaN(gameId)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const updatedGame = await prisma.games.update({
      where: { id: gameId },
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        price: body.price,
        rating: body.rating,
        releaseDate: body.releaseDate,
        genres: {
          deleteMany: {},
          connectOrCreate: body.genres.map((genre: { name: string }) => ({
            where: { name: genre.name },
            create: { name: genre.name },
          })),
        },
        platforms: {
          deleteMany: {},
          connectOrCreate: body.platforms.map((platform: { name: string }) => ({
            where: { name: platform.name },
            create: { name: platform.name },
          })),
        },
      },
    });

    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Game not found or update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = Number(params.id);
  if (isNaN(gameId)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  try {
    await prisma.games.delete({
      where: { id: gameId },
    });

    return NextResponse.json(
      { message: "Game deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Game not found or deletion failed" },
      { status: 400 }
    );
  }
}
