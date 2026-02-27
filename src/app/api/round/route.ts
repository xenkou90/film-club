import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const currentId = process.env.CURRENT_ROUND_ID ?? "may-2026";

    const rows = await db
        .select()
        .from(rounds)
        .where(eq(rounds.id, currentId))
        .limit(1);
    
    const r = rows[0];

    if (!r) {
        return NextResponse.json(
            { error: "No current round found in DB" },
            { status: 404 }
        );
    }

    // Shape it like your existing frontend expects
    return NextResponse.json({
        id: r.id,
        roundTitle: r.roundTitle,
        themeTitle: r.themeTitle,
        themeName: r.themeName,
        phase: r.phase,
        movies: r.movies,
        winnerMovie: r.winnerMovie ?? undefined,
        meeting:
            r.meetingDateText && r.meetingPlaceText
                ? { dateText: r.meetingDateText, placeText: r.meetingPlaceText }
                : undefined,
    });
}