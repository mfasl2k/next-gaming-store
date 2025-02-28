import { protectedRoute } from "@/app/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { checkCartAccess } from "../route";
import { prisma } from "@/prisma/client";

export async function DELETE(
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
