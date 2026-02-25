import { NextResponse } from "next/server";
import { round, getUserRSVP, upsertRSVP } from "@/lib/store";
import type { RSVPStatus } from "@/lib/store";

type RSVPRequestBody = {
    roundId: string;
    userId: string;
    status: RSVPStatus;
};

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

    const rsvp = getUserRSVP(roundId, userId);

    return NextResponse.json({ ok: true, rsvp });
}

export async function POST(req: Request) {
    let body: RSVPRequestBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { roundId, userId, status } = body;

    if (!roundId || !userId || !status) {
        return NextResponse.json(
            { error: "roundId, userId and status are required"},
            { status: 400 }
        );
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    // Rule: RSVP only when winner is announced
    if (round.phase !== "winner") {
        return NextResponse.json(
            { error: "RSVP is only available after the winner is announced" },
            { status: 403 }
        );
    }

    if (status !== "yes" && status !== "no") {
        return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }

    const rsvp = upsertRSVP(roundId, userId, status);

    return NextResponse.json({ ok: true, rsvp });
}