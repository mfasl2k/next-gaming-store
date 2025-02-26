import { NextRequest } from "next/server";
import { handleRequest } from "@/app/lib/apiHandler";
import { userSchema } from "@/app/lib/schema";

export async function GET(request: NextRequest) {
  return handleRequest(request, "users");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "users", userSchema);
}
