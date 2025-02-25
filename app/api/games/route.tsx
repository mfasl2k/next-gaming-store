import { NextRequest, NextResponse } from "next/server";
import { gamesSchema } from "../../lib/schema";
import { prisma } from "@/prisma/client";

export function GET(request: NextRequest) {
  return NextResponse.json([
    { id: 1, name: "Game 1", price: 100 },
    { id: 2, name: "Game 2", price: 200 },
    { id: 3, name: "Game 3", price: 300 },
  ]);
}

export async function POST(request: NextRequest) {
  // validate the reuqest body
  try {
    const body = await request.json();
    const result = gamesSchema.safeParse(body);

    if (!result.success)
      return NextResponse.json(result.error.message, { status: 400 });

    const {
      title,
      description,
      image,
      price,
      rating,
      genres,
      platforms,
      releaseDate,
    } = body;

    const newGame = await prisma.games.create({
      data: {
        title,
        description,
        image,
        price,
        rating,
        releaseDate,
        genres: {
          create: genres.map((genre: { name: string }) => ({
            genre: {
              connectOrCreate: {
                where: { name: genre.name },
                create: { name: genre.name },
              },
            },
          })),
        },
        platforms: {
          create: platforms.map((platform: { name: string }) => ({
            platform: {
              connectOrCreate: {
                where: { name: platform.name },
                create: { name: platform.name },
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
