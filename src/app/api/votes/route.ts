import { NextResponse } from "next/server";
import { round, votes } from "@/lib/store";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const roundId = searchParams.get("roundId");

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    // Start counts with 0 for every movie (stable ordering)
    const counts: Record<string, number> = Object.fromEntries(
        round.movies.map((m) => [m, 0])
    );

    // Count votes for this round
    for (const v of votes) {
        if (v.roundId === roundId && typeof counts[v.movie] === "number") {
            counts[v.movie] += 1;
        }
    }

    return NextResponse.json({ ok: true, roundId, counts });
}