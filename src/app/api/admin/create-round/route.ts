import { NextResponse } from "next/server";
import { db } from "@/db";
import { rounds, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

type Body = {
    key?: string;
    id?: string;
    roundTitle?: string;
    themeTitle?: string;
    themeName?: string;
    movies?: string[];
};

export async function POST(req: Request) {
    // Parse the request body
    let body: Body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate admin key
    const expectedKey = process.env.ADMIN_KEY ?? "";
    const providedKey = body.key ?? "";
    if (!expectedKey || providedKey !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Destructure and validate all required fields
    const { id, roundTitle, themeTitle, themeName, movies } = body;

    if (!id || !roundTitle || !themeTitle || !themeName || !movies) {
        return NextResponse.json(
            { error: "id, roundTitle, themeTitle, themeName and movies are required" },
            { status: 400 }
        );
    }

    // Validate round ID format - only lowercase letters, numbers and hyphens
    // e.g. "june-2026" is valid, "June 2026" is not
    if (!/^[a-z0-9-]+$/.test(id)) {
        return NextResponse.json(
            { error: "Round ID must be lowercase letters, numbers and hyphens only" },
            { status: 400 }
        );
    }

    // Validate exactly 5 movies
    if (movies.length !== 5) {
        return NextResponse.json(
            { error: "Exactly 5 movies are required" },
            { status: 400 }
        );
    }

    // Validated no empty movie titles
    if (movies.some((m) => m.trim() === "")) {
        return NextResponse.json(
            { error: "Movie title cannot be empty" },
            { status: 400 }
        );
    }

    // Check a round with this ID doesn't already exist
    const existing = await db
        .select({ id: rounds.id })
        .from(rounds)
        .where(eq(rounds.id, id))
        .limit(1);

    if (existing[0]) {
        return NextResponse.json(
            { error: `A round with ID "${id}" already exists` },
            { status: 409 }
        );
    }

    // Create the round - phase always starts as "voting"
    await db.insert(rounds).values({
        id,
        roundTitle,
        themeTitle,
        themeName,
        phase: "voting",
        movies: movies.map((m) => m.trim()),
    });

    // Update the setting table so this becomes the active round
    await db
        .insert(settings)
        .values({ key: "currentRoundId", value: id })
        .onConflictDoUpdate({
            target: settings.key,
            set: { value: id, updatedAt: new Date() },
        });

    return NextResponse.json({ ok: true, id });
}