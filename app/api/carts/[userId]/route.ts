import { cartSchema } from "@/app/lib/schema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  // Access the params through context
  const { userId } = context.params;
  const userIdNum = parseInt(userId);

  try {
    const user = await prisma.users.findUnique({ where: { id: userIdNum } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const cart = await prisma.carts.findMany({
      where: { userId: userIdNum },
      include: { game: true }, // Include game details
    });

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  // Access the params through context
  const { userId } = context.params;
  const userIdNum = parseInt(userId);

  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const body = await request.json();
  const validation = cartSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });

  // Check if the user has this game already in their cart
  const existingCart = await prisma.carts.findFirst({
    where: { userId: body.userId, gameId: body.gameId },
  });

  if (existingCart) {
    // Update quantity if the game is already in the cart
    const updatedCart = await prisma.carts.update({
      where: { id: existingCart.id },
      data: { quantity: existingCart.quantity + body.quantity },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  }

  // Otherwise, create a new cart entry for the game
  const createdCart = await prisma.carts.create({
    data: body,
  });

  return NextResponse.json(createdCart, { status: 201 });
}
