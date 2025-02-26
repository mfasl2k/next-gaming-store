import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; id: string };
  }
) {
  const userId = parseInt(params.userId);
  const cartId = parseInt(params.id);

  try {
    // Check if the cart item belongs to the given user
    const cartItem = await prisma.carts.findFirst({
      where: { userId, id: cartId },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.carts.delete({
      where: { id: cartId },
    });

    return NextResponse.json(
      { message: "Cart item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
