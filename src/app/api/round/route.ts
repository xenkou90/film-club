import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    // Step 1: Read currentRoundId from the setting table
    const settingRows = await db
        .select()
        .from(settings)
        .where(eq(settings.key, "currentRoundId"))
        .limit(1);

    const currentId = settingRows[0]?.value ?? process.env.CURRENT_ROUND_ID ?? "may-2026";

    // Step 2: Fetch the round using that ID
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