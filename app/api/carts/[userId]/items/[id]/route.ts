import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { protectedRoute } from "@/app/lib/authMiddleware";
import { checkCartAccess } from "../../route";

async function removeCartItem(
  request: NextRequest,
  context: { params: { userId: string; id: string } }
) {
  const { userId, id } = context.params;
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
  context: { params: { userId: string; gameId: string } }
) {
  const { userId, gameId } = context.params;
  const userIdNum = parseInt(userId);
  const gameIdNum = parseInt(gameId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to view this cart" },
      { status: 403 }
    );
  }

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
