import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";

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
    return new NextResponse(null, { status: 200 });
  }

  const session = await auth();
  const token = session?.user;

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

  return new NextResponse(null, { status: 200 });
}

export function protectedRoute<
  T extends { params: Promise<Record<string, string>> }
>(handler: (req: NextRequest, context: T) => Promise<NextResponse>) {
  return async (request: NextRequest, context: T) => {
    const result = await authMiddleware(request);

    if (result.status !== 200) {
      return result;
    }

    return handler(request, context);
  };
}

export function adminRoute<
  T extends { params: Promise<Record<string, string>> }
>(handler: (req: NextRequest, context: T) => Promise<NextResponse>) {
  return async (request: NextRequest, context: T) => {
    const result = await authMiddleware(request, { roles: [Role.ADMIN] });

    if (result.status !== 200) {
      return result;
    }

    return handler(request, context);
  };
}

export function publicRoute<
  T extends { params: Promise<Record<string, string>> }
>(handler: (req: NextRequest, context: T) => Promise<NextResponse>) {
  return async (request: NextRequest, context: T) => {
    await authMiddleware(request, { isPublic: true });
    return handler(request, context);
  };
}
