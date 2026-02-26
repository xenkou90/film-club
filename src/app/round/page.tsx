import { getSiteUrl } from "@/lib/site-url";
import RoundCard from "@/components/RoundCard";
import type { Phase } from "@/lib/types";
import PhaseWatcher from "@/components/PhaseWatcher";

type VoteCounts = Record<string, number>;

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

type RSVPStatus = "yes" | "no";

type RSVP = {
        roundId: string;
        userId: string;
        status: RSVPStatus;
        updatedAt: string;
};

const userId = "xeno";

async function getRoundData(): Promise<RoundData> {
    // IMPORTANT: one the server, use an absolute URL
    const res = await fetch(`${getSiteUrl()}/api/round`, {
        cache: "no-store", // always fresh during dev
    });

    if (!res.ok) {
        throw new Error("Failed to fetch round data");
    }

    return res.json();
}

async function getUserVote(roundId: string, userId: string) {
    const res = await fetch(
        `${getSiteUrl()}/api/vote?roundId=${encodeURIComponent(
      roundId
    )}&userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.vote ?? null;
}

async function getVoteCounts(roundId: string): Promise<VoteCounts> {
    const res = await fetch(
        `${getSiteUrl()}/api/votes?roundId=${encodeURIComponent(roundId)}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return {};
    }

    const data: { ok: boolean; counts: VoteCounts } = await res.json();
    return data.counts ?? {};
}

async function getUserRSVP(roundId: string, userId: string): Promise<RSVP | null> {
    const base = getSiteUrl();
    const res = await fetch(
        `${base}/api/rsvp?roundId=${encodeURIComponent(roundId)}&userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data: { ok: boolean; rsvp: RSVP | null } = await res.json();
    return data.rsvp ?? null;
}

export default async function RoundPage() {
    const data = await getRoundData();

    const vote = await getUserVote(data.id, userId);

    const voteCounts = await getVoteCounts(data.id);

    const rsvp = await getUserRSVP(data.id, userId);

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <PhaseWatcher roundId={data.id} phase={data.phase} />
                <RoundCard 
                    initialVoteMovie={vote?.movie ?? null}
                    userId={userId}
                    roundId={data.id}
                    roundTitle={data.roundTitle}
                    themeTitle={data.themeTitle}
                    themeName={data.themeName}
                    phase={data.phase}
                    movies={data.movies}
                    winnerMovie={data.winnerMovie}
                    meeting={data.meeting}
                    voteCounts={voteCounts}
                    initialRSVP={rsvp?.status ?? null}
                />
            </section>
        </main>
    );
}