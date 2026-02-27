import "dotenv/config";
import { db } from "./index";
import { rounds } from "./schema";

async function main() {
    const id = process.env.CURRENT_ROUND_ID ?? "may-2026";

    await db
        .insert(rounds)
        .values({
            id,
            roundTitle: "Movie Night #1 - May 2026",
            themeTitle: "Theme of the Month",
            themeName: "Neon Nights",
            phase: "voting",
            movies: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"],
            winnerMovie: null,
            meetingDateText: null,
            meetingPlaceText: null,
        })
        .onConflictDoUpdate({
            target: [rounds.id],
            set: {
                // keep seed id stable, allow re-running safely
                roundTitle: "Movie Night #1 - May 2026",
                themeTitle: "Theme of the Month",
                themeName: "Neon Nights",
                phase: "voting",
                movies: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"],
                winnerMovie: null,
                meetingDateText: null,
                meetingPlaceText: null,
                updatedAt: new Date(),
            },
        });

    console.log("✅ Seeded round:", id);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });