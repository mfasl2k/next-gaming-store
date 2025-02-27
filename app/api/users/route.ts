import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "@/app/lib/apiHandler";
import { signInSchema, userSchema } from "@/app/lib/schema";
import { prisma } from "@/prisma/client";
import { saltAndHashPassword } from "@/app/lib/bcryptHandler";

export async function GET(request: NextRequest) {
  return handleRequest(request, "users");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = signInSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await saltAndHashPassword(password);

    // Create the user
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Remove the password before returning
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
