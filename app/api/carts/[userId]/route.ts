import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { protectedRoute } from "@/app/lib/authMiddleware";
import { getToken } from "next-auth/jwt";

export async function checkCartAccess(
  request: NextRequest,
  requestedUserId: number
) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (token?.role === "ADMIN") {
    return true;
  }

  return token?.id === requestedUserId.toString();
}

async function getCartItems(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;
  const userIdNum = parseInt(userId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to view this cart" },
      { status: 403 }
    );
  }

  try {
    // Get cart items with game details
    const cartItems = await prisma.carts.findMany({
      where: {
        userId: userIdNum,
      },
      include: {
        game: true,
      },
    });

    // Transform to expected format
    const formattedItems = cartItems.map((item) => ({
      id: item.id,
      game: item.game,
      quantity: 1, // Always 1 in the single-copy approach
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = protectedRoute(getCartItems);

async function addToCart(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;
  const userIdNum = parseInt(userId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to modify this cart" },
      { status: 403 }
    );
  }

  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Check if game exists
    const game = await prisma.games.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Check if game is already in cart
    const existingItem = await prisma.carts.findFirst({
      where: {
        userId: userIdNum,
        gameId,
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { success: true, message: "Game already in cart", item: existingItem },
        { status: 200 }
      );
    }

    // Add to cart with quantity 1
    const cartItem = await prisma.carts.create({
      data: {
        userId: userIdNum,
        gameId,
        quantity: 1, // Always 1 in the single-copy approach
      },
      include: {
        game: true,
      },
    });

    return NextResponse.json({ success: true, item: cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = protectedRoute(addToCart);
