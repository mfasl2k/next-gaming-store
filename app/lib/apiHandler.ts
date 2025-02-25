import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ModelName = "games" | "genres" | "platform" | "users" | "carts";

export async function handleRequest(
  request: NextRequest,
  modelName: ModelName,
  id?: number,
  customCreateHandler?: (data: any) => Promise<any> // Custom handler for POST
) {
  const model = (prisma as any)[modelName];

  if (!model) {
    return NextResponse.json({ error: "Invalid model name" }, { status: 400 });
  }

  try {
    switch (request.method) {
      case "GET":
        if (id) {
          const data = await model.findUnique({ where: { id } });
          return data
            ? NextResponse.json(data, { status: 200 })
            : NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        const allData = await model.findMany();
        return NextResponse.json(allData, { status: 200 });

      case "POST":
        const body = await request.json();
        if (customCreateHandler) {
          const created = await customCreateHandler(body); // Call custom handler
          return NextResponse.json(created, { status: 201 });
        } else {
          const created = await model.create({ data: body });
          return NextResponse.json(created, { status: 201 });
        }

      case "PATCH":
        if (!id)
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
          );
        const updateData = await request.json();
        const updated = await model.update({ where: { id }, data: updateData });
        return NextResponse.json(updated, { status: 200 });

      case "DELETE":
        if (!id)
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
          );
        await model.delete({ where: { id } });
        return NextResponse.json(
          { message: "Deleted successfully" },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          { error: "Method not allowed" },
          { status: 405 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
