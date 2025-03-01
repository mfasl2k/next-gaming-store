import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { protectedRoute } from "@/app/lib/authMiddleware";
import { checkCartAccess } from "../../route";

async function removeCartItem(
  request: NextRequest,
  context: { params: { userId: string; gameId: string } }
) {
  const { userId, gameId } = context.params;
  const userIdNum = parseInt(userId);
  const gameIdNum = parseInt(gameId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to modify this cart" },
      { status: 403 }
    );
  }

  try {
    const deletedItem = await prisma.carts.deleteMany({
      where: {
        userId: userIdNum,
        gameId: gameIdNum,
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = protectedRoute(removeCartItem);
