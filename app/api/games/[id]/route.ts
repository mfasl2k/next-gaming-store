import { handleRequest } from "@/app/lib/apiHandler";
import { NextRequest, NextResponse } from "next/server";

async function extractParamsAndHandleRequest(
  request: NextRequest,
  params: { id: string }
) {
  const id = parseInt(params.id);
  return handleRequest(request, "games", undefined, id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return extractParamsAndHandleRequest(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return extractParamsAndHandleRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return extractParamsAndHandleRequest(request, params);
}
