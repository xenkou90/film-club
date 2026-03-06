import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { votes, rounds } from "@/db/schema";
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
            roundId: votes.roundId,
            userId: votes.userId,
            movie: votes.movie,
            createdAt: votes.createdAt,
            updatedAt: votes.updatedAt,
        })
        .from(votes)
        .where(and(eq(votes.roundId, roundId), eq(votes.userId, userId)))
        .limit(1);
    
    return NextResponse.json({ ok: true, vote: row[0] ?? null });
}

export async function POST(req: Request) {
    // Read userId from session - never trust the client for this
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.email;

    let body: { roundId?: string; movie?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { roundId, movie } = body;

    if (!roundId || !movie) {
        return NextResponse.json(
            { error: "roundId and movie are required" },
            { status: 400 }
        );
    }

    const roundRows = await db
        .select()
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .limit(1);

    const r = roundRows[0];
    if (!r) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    if (r.phase !== "voting") {
        return NextResponse.json({ error: "Voting is not open" }, { status: 403 });
    }

    const movies = (r.movies ?? []) as string[];
    if (!movies.includes(movie)) {
        return NextResponse.json({ error: "Invalid movie" }, { status: 400 });
    }

    const updatedAt = new Date();
    const result = await db
        .insert(votes)
        .values({ roundId, userId, movie })
        .onConflictDoUpdate({
            target: [votes.roundId, votes.userId],
            set: { movie, updatedAt },
        })
        .returning({
            roundId: votes.roundId,
            userId: votes.userId,
            movie: votes.movie,
            createdAt: votes.createdAt,
            updatedAt: votes.updatedAt,
        });

    return NextResponse.json({ ok: true, vote: result[0] });
}