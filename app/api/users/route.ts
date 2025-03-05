import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/app/lib/schema";
import { prisma } from "@/prisma/client";
import { saltAndHashPassword } from "@/app/lib/bcryptHandler";
import { adminRoute, publicRoute } from "@/app/lib/authMiddleware";

async function getUsers() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = adminRoute(getUsers);

async function createUser(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await saltAndHashPassword(body.password);

    const newUser = await prisma.users.create({
      data: {
        ...body,
        password: hashedPassword,
        role: "USER", // Default role
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        // Exclude password from response
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = publicRoute(createUser);
