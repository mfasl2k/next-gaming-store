import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";

export function GET(request: NextRequest) {
  return NextResponse.json([
    { id: 1, name: "Game 1", price: 100 },
    { id: 2, name: "Game 2", price: 200 },
    { id: 3, name: "Game 3", price: 300 },
  ]);
}

export async function POST(request: NextRequest) {
  // validate the reuqest body

  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success)
    return NextResponse.json(result.error.message, { status: 400 });
  return NextResponse.json(
    { name: body.name, price: body.price },
    { status: 201 }
  );
}
