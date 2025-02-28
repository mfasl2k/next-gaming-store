// app/lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";
import { getToken } from "next-auth/jwt";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

type AuthOptions = {
  roles?: Role[];
  isPublic?: boolean;
};

export async function authMiddleware(
  request: NextRequest,
  options: AuthOptions = {}
) {
  const { roles = [], isPublic = false } = options;

  if (isPublic) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Authentication required" },
      { status: 401 }
    );
  }

  if (roles.length > 0) {
    const userRole = (token.role as Role) || Role.USER;

    if (!roles.includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export function protectedRoute() {
  return async (request: NextRequest) => {
    return authMiddleware(request);
  };
}

export function adminRoute() {
  return async (request: NextRequest) => {
    return authMiddleware(request, { roles: [Role.ADMIN] });
  };
}

export function publicRoute() {
  return async (request: NextRequest) => {
    return authMiddleware(request, { isPublic: true });
  };
}
