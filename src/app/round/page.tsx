import RoundCard from "@/components/RoundCard";

type Phase = "voting" | "closed" | "winner";

export default function RoundPage() {
    const phase: Phase = "voting"; // Change this to "voting", "closed", or "winner" to test different phases

    const movies = ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"];

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <RoundCard
                    roundTitle="Movie Night #1 - May 2026"
                    themeTitle="Theme of the Month"
                    themeName="Neon Nights"
                    phase={phase}
                    movies={movies}
                    winnerMovie="Movie 3"
                    meeting={{ dateText: "May 24, 20:30", placeText: "You know where!" }}
                />
            </section>
        </main>
    );
}