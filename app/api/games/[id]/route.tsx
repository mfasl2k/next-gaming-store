import { NextRequest, NextResponse } from "next/server";

export function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  // This is a simple example of how to handle a request with a dynamic route
  if (params.id > 10)
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  return NextResponse.json({ id: params.id, name: `Game ${params.id}` });
}
