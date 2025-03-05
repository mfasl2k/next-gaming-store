import { protectedRoute } from "@/app/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

async function removeAllCartItem(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const userIdNum = parseInt(userId);

  try {
    await prisma.carts.deleteMany({
      where: { userId: userIdNum },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = protectedRoute(removeAllCartItem);
