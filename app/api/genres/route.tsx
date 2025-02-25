import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // Ensure you have prisma client setup
// Ensure you have the Genre model setup

export async function GET(request: NextRequest) {
  const genres = await prisma.genres.findMany();
  return NextResponse.json(genres);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const genre = await prisma.genres.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
