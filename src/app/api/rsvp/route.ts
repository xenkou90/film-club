import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { rounds, rsvps } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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
    // Read userId from session - never trust the client for this
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.email;

    let body: { roundId?: string; status?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { roundId, status } = body;

    if (!roundId || !status) {
        return NextResponse.json(
            { error: "roundId and status are required" },
            { status: 400 }
        );
    }

    const roundRows = await db
        .select({ id: rounds.id, phase: rounds.phase, winnerMovie: rounds.winnerMovie })
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .limit(1);

    const r = roundRows[0];
    if (!r) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    if (r.phase !== "winner" || !r.winnerMovie ) {
        return NextResponse.json(
            { error: "RSVP is only available after the winner is announced" },
            { status: 403 }
        );
    }

    if (status !== "yes" && status !== "no") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedAt = new Date();
    const result = await db
        .insert(rsvps)
        .values({ roundId, userId, status })
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