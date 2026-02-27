import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, votes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const roundId = searchParams.get("roundId");

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    // Load round from DB so we know the official movie list
    const roundRows = await db
        .select({ id: rounds.id, movies: rounds.movies })
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .limit(1);

    const r = roundRows[0];

    if (!r) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    const movies = (r.movies ??[]) as string[];

    // Count votes grouped by movie for this round
    const rows = await db
        .select({
            movie: votes.movie,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(votes)
        .where(eq(votes.roundId, roundId))
        .groupBy(votes.movie);

    // Start with 0 for every movie (stable ordering / includes zeros)
    const counts: Record<string, number> = Object.fromEntries(
        movies.map((m) => [m, 0])
    );

    // Fill counts from DB results
    for (const row of rows) {
        if (typeof counts[row.movie] === "number") {
            counts[row.movie] = row.count;
        }
    }

    return NextResponse.json({ ok: true, roundId, counts });
}