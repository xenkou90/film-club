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