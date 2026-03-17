import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, users, votes, settings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") ?? "";

    const expectedKey = process.env.ADMIN_KEY ?? "";
    if (!expectedKey || key !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current round ID from settings
    const settingRows = await db
        .select()
        .from(settings)
        .where(eq(settings.key, "currentRoundId"))
        .limit(1);

    const currentId = settingRows[0]?.value ?? process.env.CURRENT_ROUND_ID ?? null;

    // Get current round data
    let round = null;
    let voteCounts: Record<string, number> = {};

    if (currentId) {
        const roundRows = await db
            .select()
            .from(rounds)
            .where(eq(rounds.id, currentId))
            .limit(1);

        round = roundRows[0] ?? null;

        if (round) {
            // Get vote counts per movie
            const voteRows = await db
                .select({
                    movie: votes.movie,
                    count: sql<number> `count(*)`.mapWith(Number),
                })
                .from(votes)
                .where(eq(votes.roundId, currentId))
                .groupBy(votes.movie);

            // Seed zeros for all movies
            voteCounts = Object.fromEntries(
                (round.movies as string[]).map((m) => [m, 0])
            );

            // Fill in actual counts
            for (const row of voteRows) {
                if (typeof voteCounts[row.movie] === "number") {
                    voteCounts[row.movie] = row.count;
                }
            }
        }
    }

    // Get all members
    const memberRows = await db
        .select({email: users.email })
        .from(users);

    return NextResponse.json({
        ok: true,
        round: round ? {
            id: round.id,
            roundTitle: round.roundTitle,
            phase: round.phase,
            voteCounts,
        } : null,
        members: memberRows.map((m) => m.email),
    });
}