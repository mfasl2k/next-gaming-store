import { NextRequest } from "next/server";
import { handleRequest } from "@/app/lib/apiHandler";
import { gamesSchema } from "@/app/lib/schema";

export async function GET(request: NextRequest) {
  return handleRequest(request, "games");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "games", gamesSchema);
}
