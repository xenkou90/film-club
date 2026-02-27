import { NextResponse } from "next/server";
import { db } from "@/db";
import { rsvps } from "@/db/schema";
import { round } from "@/lib/store";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const key = searchParams.get("key") ?? "";
    const roundId = searchParams.get("roundId") ?? "";

    const expectedKey = process.env.ADMIN_KEY ?? "";

    if (!expectedKey || key !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    const rows = await db
        .select({
            status: rsvps.status,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(rsvps)
        .where(eq(rsvps.roundId, roundId))
        .groupBy(rsvps.status);

    let yes = 0;
    let no = 0;

    for (const r of rows) {
        if (r.status === "yes") yes = r.count;
        if(r.status === "no") no = r.count;
    }

    return NextResponse.json({ ok: true, roundId, counts: { yes, no, total: yes + no } });
}