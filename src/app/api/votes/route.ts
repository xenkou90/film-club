import { NextResponse } from "next/server";
import { db } from "@/db";
import { votes } from "@/db/schema";
import { round } from "@/lib/store";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const roundId = searchParams.get("roundId");

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    // DB counts by movie
    const rows = await db
        .select({
            movie: votes.movie,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(votes)
        .where(eq(votes.roundId, roundId))
        .groupBy(votes.movie);

    // Start from 0 for every movie (stable)
    const counts: Record<string, number> = Object.fromEntries(
        round.movies.map((m) => [m, 0])
    );

    for (const r of rows) {
        if (typeof counts[r.movie] === "number") {
            counts[r.movie] = r.count;
        }
    }

    return NextResponse.json({ ok: true, roundId, counts });
}