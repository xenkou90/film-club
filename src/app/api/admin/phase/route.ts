import  { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Phase } from "@/lib/types";

type Body = {
    key?: string;
    phase?: Phase;
};

export async function POST(req: Request) {
    let body: Body;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_KEY ?? "";
    const providedKey = body.key ?? "";

    if (!expectedKey || providedKey !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const phase = body.phase;

    if (phase !== "voting" && phase !== "closed" && phase !== "winner") {
        return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
    }

    const currentId = process.env.CURRENT_ROUND_ID ?? "may-2026";

    await db
        .update(rounds)
        .set({ phase, updatedAt: new Date() })
        .where(eq(rounds.id, currentId));

    const [updated] = await db.select().from(rounds).where(eq(rounds.id, currentId));
    return NextResponse.json({ ok: true, rounds: updated });
}