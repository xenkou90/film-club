export type Phase = "voting" | "closed" | "winner";

export type RoundData = {
    id: string;
    roundTitle: string;
    themeTitle: string;
    themeName: string;
    phase: Phase;
    movies: string[];
    winnerMovie?: string;
    meeting?: { dateText: string; placeText: string };
};

export type Vote = {
    roundId: string;
    userId: string;
    movie: string;
    createdAt: string;
};

// IMPORTANT: This is in-memory (resets when server restarts)
export const round: RoundData = {
    id: "may-2026",
    roundTitle: "Movie Night #1 - May 2026",
    themeTitle: "Theme of the Month",
    themeName: "Neon Nights",
    phase: "voting",
    movies: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"],
    winnerMovie: "Movie 3",
    meeting: { dateText: "May 24, 20:30", placeText: "You know where!" },
};

export const votes: Vote[] = [];

export function getUserVote(roundId: string, userId: string) {
    return votes.find((v) => v.roundId === roundId && v.userId === userId) ?? null;
}

export function upsertVote(roundId: string, userId: string, movie: string) {
    const existing = getUserVote(roundId, userId);

    if (existing) {
        //update vote (we allow changes during voting phase for now)
        existing.movie = movie;
        return existing;
    }

    const newVote: Vote = {
        roundId,
        userId,
        movie,
        createdAt: new Date().toISOString(),
    };

    votes.push(newVote);
    return newVote;
}

export function setRoundPhase(newPhase: Phase) {
    round.phase = newPhase;
}

export function computeVoteCounts(roundId: string) {
    // Create a stable counts object: every movie starts at 0
    const counts: Record<string, number> = Object.fromEntries(
        round.movies.map((m) => [m, 0]) 
    );

    // Add +1 for every vote that matches the round and a valid movie
    for (const v of votes) {
        if (v.roundId === roundId && typeof counts[v.movie] === "number") {
            counts[v.movie] += 1;
        }
    }

    return counts;
}

export function pickWinnerForRound(roundId: string) {
    const counts = computeVoteCounts(roundId);

    // Find the maximum vote count
    const maxVotes = Math.max(...Object.values(counts));

    // Get all movies tied for maxVotes
    const tied = Object.entries(counts)
        .filter(([, c]) => c === maxVotes)
        .map(([movie]) => movie);

    // If nobody voted, we can't pick a winner
    if (maxVotes === 0 || tied.length === 0) {
        return { winner: null as string | null, counts, tied };
    }

    // If tie, pick randomly among tied
    const winner =
        tied.length === 1
            ? tied[0]
            : tied[Math.floor(Math.random() * tied.length)];

    // Persist winner in the in-memory "round"
    round.winnerMovie = winner;

    return { winner, counts, tied };
}

export function setMeetingDetails(dateText: string, placeText: string) {
    round.meeting = { dateText, placeText };
}