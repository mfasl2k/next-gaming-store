import { auth } from "@/app/auth";
import { adminRoute, protectedRoute } from "@/app/lib/authMiddleware";
import { saltAndHashPassword } from "@/app/lib/bcryptHandler";
import { prisma } from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

async function checkUserAccess(request: NextRequest, requestedUserId: number) {
  const session = await auth();

  if (session?.user.role === "ADMIN") {
    return true;
  }

  return session?.user.id === requestedUserId.toString();
}

async function getUserById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = parseInt(id);

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        // Exclude password
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export const GET = protectedRoute(getUserById);

async function updateUser(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = parseInt(id);

  const hasAccess = await checkUserAccess(request, userId);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You don't have permission to modify this user" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (body.role && token?.role !== "ADMIN") {
      delete body.role; // Remove role from update data
    }

    if (body.password) {
      body.password = await saltAndHashPassword(body.password);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: body,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        // Exclude password
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const PATCH = protectedRoute(updateUser);

async function deleteUser(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = parseInt(id);

  try {
    await prisma.carts.deleteMany({
      where: { userId },
    });

    await prisma.users.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const DELETE = adminRoute(deleteUser);
