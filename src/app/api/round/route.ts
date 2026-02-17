import { NextResponse } from "next/server";

export type Phase = "voting" | "closed" | "winner";

type RoundResponse = {
    roundTitle: string;
    themeTitle: string;
    themeName: string;
    phase: Phase;
    movies: string[];
    winnerMovie?: string;
    meeting?: {
        dateText: string;
        placeText: string;
    };
};

export async function GET() {
    //Temporary "backend data" (later: DB)
    const data: RoundResponse = {
        roundTitle: "Movie Night #1 - May 2026",
        themeTitle: "Theme of the Month",
        themeName: "Neon Nights",
        phase: "winner",
        movies: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"],
        winnerMovie: "Movie 3",
        meeting: { dateText: "May 24, 20:30", placeText: "You know where!" },
    };

return NextResponse.json(data);
}