import { NextResponse } from "next/server";
import { round, upsertVote, votes } from "@/lib/store";

type VoteRequestBody = {
    roundId: string;
    userId: string;
    movie: string;
};

export async function POST(req: Request) {
    let body: VoteRequestBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { roundId, userId, movie } = body;

    if (!roundId || !userId || !movie) {
        return NextResponse.json(
            { error: "roundId, userId, and movie are required" },
            { status: 400 }
        );
    }

    if (roundId !== roundId) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    if (round.phase !== "voting") {
        return NextResponse.json(
            { error: "Voting is not open" },
            { status: 403 }
        );
    }

    if (!round.movies.includes(movie)) {
        return NextResponse.json({ error: "Invalid movie"}, { status: 400 });
    }

    const vote = upsertVote(roundId, userId, movie);

    return NextResponse.json({ ok: true, vote});
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const roundId = searchParams.get("roundId");
    const userId = searchParams.get("userId");

    if (!roundId || !userId) {
        return NextResponse.json(
            { error: "roundId and userId are required" },
            { status: 400 }
        );
    }

    const vote = 
    votes.find((v) => v.roundId === roundId && v.userId === userId) ?? null;

    return NextResponse.json({ ok: true, vote });
}