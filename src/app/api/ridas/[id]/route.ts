import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Rida } from "@/models/Rida";
import { requireAuth } from "@/middleware/auth";
import { updateRidaSchema } from "@/lib/validators";

async function getHandler(
  _req: NextRequest,
  context: { params?: Promise<Record<string, string>> },
  _payload: { userId: string; email: string }
) {
  try {
    const params = await context.params!;
    const id = params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Rida ID" }, { status: 400 });
    }
    await connectDB();
    const rida = await Rida.findById(id).lean();
    if (!rida) {
      return NextResponse.json({ error: "Rida not found" }, { status: 404 });
    }
    return NextResponse.json(rida);
  } catch (err) {
    console.error("GET /api/ridas/:id:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function putHandler(
  req: NextRequest,
  context: { params?: Promise<Record<string, string>> },
  _payload: { userId: string; email: string }
) {
  try {
    const params = await context.params!;
    const id = params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Rida ID" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateRidaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const rida = await Rida.findById(id);
    if (!rida) {
      return NextResponse.json({ error: "Rida not found" }, { status: 404 });
    }

    const updates = parsed.data;
    if (updates.ridaName != null) rida.ridaName = updates.ridaName.trim();
    if (updates.price != null) rida.price = updates.price;
    if (updates.profit != null) rida.profit = updates.profit;

    await rida.save();
    return NextResponse.json(rida.toObject());
  } catch (err) {
    console.error("PUT /api/ridas/:id:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  _req: NextRequest,
  context: { params?: Promise<Record<string, string>> },
  _payload: { userId: string; email: string }
) {
  try {
    const params = await context.params!;
    const id = params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Rida ID" }, { status: 400 });
    }
    await connectDB();
    const deleted = await Rida.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Rida not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/ridas/:id:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getHandler);
export const PUT = requireAuth(putHandler);
export const DELETE = requireAuth(deleteHandler);
