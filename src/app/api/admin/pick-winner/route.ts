import { NextResponse } from "next/server";
import { round, pickWinnerForRound } from "@/lib/store";
import { db } from "@/db";
import { votes } from "@/db/schema";
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

    const roundId = body.roundId ?? "";

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    // Optional guard: you usually pick a winner only after voting closes
    if (round.phase !== "closed") {
        return NextResponse.json(
            { error: "You can only pick a winner when phase is closed" },
            { status: 403 }
        );
    }

    const rows = await db
        .select({
            movie: votes.movie,
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(votes)
        .where(eq(votes.roundId, roundId))
        .groupBy(votes.movie);

    const counts: Record<string, number> = Object.fromEntries(
        round.movies.map((m) => [m, 0])
    );

    for (const r of rows) {
        if (typeof counts[r.movie] === "number") {
            counts[r.movie] = r.count;
        }
    }

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

    round.winnerMovie = winner;

    return NextResponse.json({ ok: true, winner, tied, counts, round });
}