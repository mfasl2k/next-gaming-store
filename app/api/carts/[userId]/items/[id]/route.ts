import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { protectedRoute } from "@/app/lib/authMiddleware";

async function removeCartItem(
  request: NextRequest,
  context: { params: Promise<{ userId: string; id: string }> }
) {
  const { userId, id } = await context.params;
  const userIdNum = parseInt(userId);
  const itemId = parseInt(id);

  try {
    const cartItem = await prisma.carts.findFirst({
      where: {
        id: itemId,
        userId: userIdNum,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    await prisma.carts.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error removing cart item:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = protectedRoute(removeCartItem);

async function checkGameInCart(
  request: NextRequest,
  context: { params: Promise<{ userId: string; gameId: string }> }
) {
  const { userId, gameId } = await context.params;
  const userIdNum = parseInt(userId);
  const gameIdNum = parseInt(gameId);

  try {
    const cartItem = await prisma.carts.findFirst({
      where: {
        userId: userIdNum,
        gameId: gameIdNum,
      },
    });

    return NextResponse.json({
      inCart: !!cartItem,
      item: cartItem,
    });
  } catch (error) {
    console.error("Error checking cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = protectedRoute(checkGameInCart);
