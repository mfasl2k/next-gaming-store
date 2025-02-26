import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { ZodSchema } from "zod";

type ModelName = "games" | "users" | "carts";

async function findModelById(model: any, id: number) {
  const data = await model.findUnique({
    where: { id },
  });
  return data ? data : null; // Return null if not found
}

export async function handleRequest(
  request: NextRequest,
  modelName: ModelName,
  validationSchema?: ZodSchema,
  id?: number
) {
  const model = (prisma as any)[modelName];

  if (!model) {
    return NextResponse.json({ error: "Invalid model name" }, { status: 400 });
  }

  try {
    switch (request.method) {
      case "GET":
        if (id) {
          const data = await findModelById(model, id);
          if (!data) {
            return NextResponse.json(
              { error: "Data is Not found" },
              { status: 404 }
            );
          }
          NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        const allData = await model.findMany();
        return NextResponse.json(allData, { status: 200 });

      case "POST":
        const body = await request.json();
        const validation = validationSchema?.safeParse(body);
        if (!validation?.success)
          return NextResponse.json(validation?.error.errors, {
            status: 400,
          });
        const created = await model.create({ data: body });
        return NextResponse.json(created, { status: 201 });

      case "PATCH":
        const patchData = await findModelById(model, id!);
        if (!patchData) {
          return NextResponse.json(
            { error: " Data is Not found" },
            { status: 404 }
          );
        }
        const updateData = await request.json();
        const updated = await model.update({ where: { id }, data: updateData });
        return NextResponse.json(updated, { status: 200 });

      case "DELETE":
        const deleteData = await findModelById(model, id!);
        if (!deleteData) {
          return NextResponse.json(
            { error: "Data is Not found" },
            { status: 404 }
          );
        }
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
