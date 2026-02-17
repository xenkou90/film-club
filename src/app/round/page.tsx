import RoundCard from "@/components/RoundCard";
import type { Phase } from "@/app/api/round/route";

type RoundData = {
    id: string;
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

async function getRoundData(): Promise<RoundData> {
    // IMPORTANT: one the server, use an absolute URL
    const res = await fetch("http://localhost:3000/api/round", {
        cache: "no-store", // always fresh during dev
    });

    if (!res.ok) {
        throw new Error("Failed to fetch round data");
    }

    return res.json();
}

export default async function RoundPage() {
    const data = await getRoundData();

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <RoundCard 
                    roundId={data.id}
                    roundTitle={data.roundTitle}
                    themeTitle={data.themeTitle}
                    themeName={data.themeName}
                    phase={data.phase}
                    movies={data.movies}
                    winnerMovie={data.winnerMovie}
                    meeting={data.meeting}
                />
            </section>
        </main>
    );
}