import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, votes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

type Body = {
    key?: string;
    roundId?: string;
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
        return NextResponse.json({ error: "Unauthorized" }, {status: 401 });
    }

    // Canonical round id comes from env (single source of truth)
    const currentId = process.env.CURRENT_ROUND_ID ?? "may-2026";

    // Fetch the round row from DB
    const roundRows = await db
        .select()
        .from(rounds)
        .where(eq(rounds.id, currentId))
        .limit(1);

    const r = roundRows[0];

    if (!r) {
        return NextResponse.json(
            { error: "No current round found", currentId },
            { status: 404 }
        );
    }

    // Optional guard: only pick winner after voting closes (from DB)
    if (r.phase !== "closed") {
        return NextResponse.json(
            { error: "You can only pick a winner when phase is closed", phase: r.phase },
            { status: 403 }
        );
    }

    // Count votes from DB
    const rows = await db
        .select({
            movie: votes.movie,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(votes)
        .where(eq(votes.roundId, currentId))
        .groupBy(votes.movie);

    // Build zeroed counts from DB movies
    const counts: Record<string, number> = Object.fromEntries(
        (r.movies ?? []).map((m) => [m, 0])
    );

    // Fill counts from actual vote rows
    for (const row of rows) {
        if (typeof counts[row.movie] === "number") {
            counts[row.movie] = row.count;
        }
    }

    // Determine winner
    const maxVotes = Math.max(...Object.values(counts));
    const tied = Object.entries(counts)
        .filter(([, c]) => c === maxVotes)
        .map(([movie]) => movie);

    if (maxVotes === 0 || tied.length === 0) {
        return NextResponse.json(
            { error: "No votes yet - cannot pick a winner", counts },
            { status: 409 }
        );
    }

    const winner =
        tied.length === 1 ? tied[0] : tied[Math.floor(Math.random() * tied.length)];

    // Persist winner to DB (and optionally advance phase)
    await db
        .update(rounds)
        .set({
            winnerMovie: winner,
            updatedAt: new Date(),
        })
        .where(eq(rounds.id, currentId));

    // Return shape UI expects
    return NextResponse.json({
        ok: true,
        roundId: currentId,
        winner,
        tied,
        counts,
    });
}