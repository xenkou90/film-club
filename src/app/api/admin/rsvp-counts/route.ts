import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, rsvps } from "@/db/schema";
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

    // Validate roundId against the DB
    const roundRows = await db
        .select({ id: rounds.id })
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .limit(1);

    if (!roundRows[0]) {
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