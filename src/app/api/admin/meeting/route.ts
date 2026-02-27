import {NextResponse } from "next/server";
import { db } from "@/db";
import { rounds } from "@/db/schema";
import { eq } from "drizzle-orm";

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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roundId = body.roundId ?? "";
    const dateText = (body.dateText ?? "").trim();
    const placeText = (body.placeText ?? "").trim();

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (!dateText || !placeText) {
        return NextResponse.json(
            { error: "dateText and placeText are required" },
            { status: 400 }
        );
    }

    const currentId = process.env.CURRENT_ROUND_ID ?? "may-2026";

    if (roundId !== currentId) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    await db
        .update(rounds)
        .set({
            meetingDateText: dateText,
            meetingPlaceText: placeText,
            updatedAt: new Date(),
        })
        .where(eq(rounds.id, currentId));

    const [updatedRound] = await db
        .select()
        .from(rounds)
        .where(eq(rounds.id, currentId));

    if (!updatedRound) {
        return NextResponse.json(
            { error: "Round not found after update" },
            { status: 500 }
        );
    }

    return NextResponse.json({
        ok: true,
        round: updatedRound,
        meeting: {
            dateText: updatedRound.meetingDateText,
            placeText: updatedRound.meetingPlaceText,
        },
    });
}