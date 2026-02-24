import { NextResponse } from "next/server";
import { round, pickWinnerForRound } from "@/lib/store";

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

    const result = pickWinnerForRound(roundId);

    if (!result.winner) {
        return NextResponse.json(
            { error: "No votes yet - cannot pick a winner", counts: result.counts },
            { status: 409 }
        );
    }

    // You can choose to auto-advance phase here but we"ll keep it normal for now:
    // round.phase = "winner";

    return NextResponse.json({
        ok: true,
        winner: result.winner,
        tied: result.tied,
        counts: result.counts,
        round,
    });
}