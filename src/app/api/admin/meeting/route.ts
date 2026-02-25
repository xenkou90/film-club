import {NextResponse } from "next/server";
import { round, setMeetingDetails } from "@/lib/store";

type Body = {
    key?: string;
    roundId?: string;
    dateText?: string;
    placeText?: string;
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
        return NextResponse.json({ error: "Unauthorizes" }, { status: 401 });
    }

    const roundId = body.roundId ?? "";
    const dateText = (body.dateText ?? "").trim();
    const placeText = (body.placeText ?? "").trim();

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    if (!dateText || !placeText) {
        return NextResponse.json(
            { error: "dateText and placeText are required" },
            { status: 400 }
        );
    }

    setMeetingDetails(dateText, placeText);

    return NextResponse.json({ ok: true, meeting: round.meeting, round });
}