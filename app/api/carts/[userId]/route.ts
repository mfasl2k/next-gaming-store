import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { cartSchema } from "@/app/lib/schema";
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

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  const middlewareResponse = await protectedRoute()(request);
  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

  const userId = await context.params.userId;
  const userIdNum = parseInt(userId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to access this cart" },
      { status: 403 }
    );
  }

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
  const middlewareResponse = await protectedRoute()(request);
  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

  const { userId } = context.params;
  const userIdNum = parseInt(userId);

  const hasAccess = await checkCartAccess(request, userIdNum);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to modify this cart" },
      { status: 403 }
    );
  }

  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const body = await request.json();
  const validation = cartSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });

  const existingCart = await prisma.carts.findFirst({
    where: { userId: body.userId, gameId: body.gameId },
  });

  if (existingCart) {
    const updatedCart = await prisma.carts.update({
      where: { id: existingCart.id },
      data: { quantity: existingCart.quantity + body.quantity },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  }

  const createdCart = await prisma.carts.create({
    data: body,
  });

  return NextResponse.json(createdCart, { status: 201 });
}
