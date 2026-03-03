import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Rida } from "@/models/Rida";
import { requireAuth } from "@/middleware/auth";
import { createRidaSchema } from "@/lib/validators";

async function getHandler(
  req: NextRequest,
  _context: { params?: Promise<Record<string, string>> },
  _payload: { userId: string; email: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.ridaName = new RegExp(search, "i");
    }

    const list = await Rida.find(filter).sort({ ridaName: 1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    console.error("GET /api/ridas:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function postHandler(
  req: NextRequest,
  _context: { params?: Promise<Record<string, string>> },
  _payload: { userId: string; email: string }
) {
  try {
    const body = await req.json();
    const parsed = createRidaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { ridaName, price, profit } = parsed.data;

    await connectDB();

    const existing = await Rida.findOne({ ridaName: { $regex: new RegExp(`^${ridaName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
    if (existing) {
      return NextResponse.json(
        { error: "Rida with this name already exists" },
        { status: 409 }
      );
    }

    const doc = await Rida.create({
      ridaName: ridaName.trim(),
      price,
      profit,
    });

    return NextResponse.json(doc.toObject(), { status: 201 });
  } catch (err) {
    console.error("POST /api/ridas:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
