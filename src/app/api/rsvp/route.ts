import { NextResponse } from "next/server";
import { db } from "@/db";
import { rsvps } from "@/db/schema";
import { round } from "@/lib/store";
import { and, eq } from "drizzle-orm";

type RSVPStatus = "yes" | "no";

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

    const row = await db
        .select({
            roundId: rsvps.roundId,
            userId: rsvps.userId,
            status: rsvps.status,
            updatedAt: rsvps.updatedAt,
        })
        .from(rsvps)
        .where(and(eq(rsvps.roundId, roundId), eq(rsvps.userId, userId)))
        .limit(1);

    return NextResponse.json({ ok: true, rsvp: row[0] ?? null });
}

export async function POST(req: Request) {
    let body: RSVPRequestBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalida JSON body" }, { status: 400 });
    }

    const { roundId, userId, status } = body;

    if (!roundId || !userId || !status) {
        return NextResponse.json(
            { error: "roundId, userId and status are required" },
            { status: 400 }
        );
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    if (round.phase !== "winner") {
        return NextResponse.json(
            { error: "RSVP is only available after the winner is announced" },
            { status: 403 }
        );
    }

    if (status !== "yes" && status !== "no"){
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedAt = new Date();

    const result = await db
        .insert(rsvps)
        .values({
            roundId,
            userId,
            status,
        })
        .onConflictDoUpdate({
            target: [rsvps.roundId, rsvps.userId],
            set: { status, updatedAt },
        })
        .returning({
            roundId: rsvps.roundId,
            userId: rsvps.userId,
            status: rsvps.status,
            updatedAt: rsvps.updatedAt,
        });

    return NextResponse.json({ ok: true, rsvp: result[0] });
}