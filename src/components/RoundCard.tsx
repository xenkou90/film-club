"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


type Phase = "voting" | "closed" | "winner";

type RoundCardProps = {
    userId: string;
    initialVoteMovie?: string | null;
    voteCounts?: Record<string, number>;
    initialRSVP?: "yes" | "no" | null;
    roundId: string;
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

export default function RoundCard(props: RoundCardProps) {
    const { userId, initialVoteMovie, voteCounts, initialRSVP, roundId, roundTitle, themeTitle, themeName, phase, movies, winnerMovie, meeting } =
        props;

    const [selectedMovie, setSelectedMovie] = useState<string | null>(
        initialVoteMovie ?? null
    );
    const [submitted, setSubmitted] = useState(Boolean(initialVoteMovie));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voteError, setVoteError] = useState<string | null>(null);
    const [voteSuccess, setVoteSuccess] = useState<string | null>(null);

    const [liveVoteCounts, setLiveVoteCounts] = useState<Record<string, number> | null>(null);

    const displayVoteCounts = liveVoteCounts ?? voteCounts ?? {};

    const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | null>(initialRSVP ?? null);
    const [rsvpError, setRsvpError] = useState<string | null>(null);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);

    async function handleVoteSubmit() {
        if (!selectedMovie) return;

        setVoteError(null);
        setVoteSuccess(null);
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roundId,
                    userId,
                    movie: selectedMovie,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setVoteError(data?.error ?? "Vote failed.");
                return;
            }

            setSubmitted(true);
            setVoteSuccess(`Vote saved: ${selectedMovie}`);

            await refreshVoteCounts();

        } catch (err) {
            setVoteError("Network error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleChangeVote() {
        setSubmitted(false);
        setSelectedMovie(null);
        setVoteError(null);
        setVoteSuccess(null);
    }

    async function refreshVoteCounts() {
        try {
            const res = await fetch(`/api/votes?roundId=${encodeURIComponent(roundId)}`, {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                return;
            }

            setLiveVoteCounts(data.counts ?? {});
        } catch {
            // ignore for now
        }
    }

    async function submitRSVP(status: "yes" | "no") {
        setRsvpError(null);
        setRsvpSubmitting(true);

        try {
            const res = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roundId, userId, status }),
            });

            const data = await res.json();

            if (!res.ok) {
                setRsvpError(data?.error ?? "RSVP failed");
                return;
            }

            setRsvpStatus(status);
        } catch {
            setRsvpError("Network error");
        } finally {
            setRsvpSubmitting(false);
        }
    }

    return (
        <div className="brut-card w-full">
            <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                {roundTitle}
            </p>

            <h1 className="mt-2 text-2xl font-extrabold leading-tight">{themeTitle}</h1>

            <p className="mt-2 font-bold">{themeName}</p>

            <div className="mt-6">
                <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
                    Phase
                </p>

                {phase === "voting" && (
                    <>
                        <p className="mt-1 font-extrabold">Voting Open (Day 1-5)</p>
                        
                        {voteError && (
                            <p role="alert" className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-[#ffd6d6]">
                                {voteError}
                            </p>
                        )}

                        {voteSuccess && (
                            <p className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-[#d7fff0]">
                                {voteSuccess}
                            </p>
                        )}

                        <div className="mt-4 grid gap-3">
                            {movies.map((title) => {
                                const isSelected = selectedMovie === title;

                                return (
                                    <button
                                        key={title}
                                        type="button"
                                        className={[
                                            "brut-btn",
                                            isSelected ? "bg-[#1f046e] text-white" : "bg-white text-black",
                                        ].join(" ")}
                                        onClick={() => setSelectedMovie(title)}
                                        disabled={submitted}
                                        title={submitted ? "Vote submitted" : ""}
                                    >
                                        <span className="flex w-full items-center justify-between gap-3">
                                            <span className="font-extrabold">
                                                {isSelected ? "Selected: " : "Vote: "}
                                                {title}
                                            </span>

                                            <span className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                                                {displayVoteCounts?.[title] ?? 0} votes
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="brut-btn bg-[#b8ff66]"
                                    disabled={!selectedMovie || submitted}
                                    title={
                                        !selectedMovie
                                            ? "Pick a movie first"
                                            : submitted
                                            ? "Vote submitted"
                                            : ""
                                    }
                                >
                                    {submitted ? "Vote submitted" : "Submit vote"}
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-extrabold">
                                        Confirm your vote
                                    </AlertDialogTitle>

                                    <AlertDialogDescription className="text-sm font-bold opacity-90">
                                        You're about to vote for{" "}
                                        <span className="underline">{selectedMovie ?? "—"}</span>.
                                        {` `}
                                        This will lock your vote.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel asChild>
                                        <Button className="brut-btn bg-white">Cancel</Button>
                                    </AlertDialogCancel>

                                    <AlertDialogAction asChild>
                                        <Button
                                            className="brut-btn bg-[#1f046e] text-white"
                                            onClick={handleVoteSubmit}
                                            disabled={isSubmitting || submitted}
                                        >
                                            {isSubmitting ? "Submitting..." : "Confirm"}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                        {submitted && (
                            <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-white">
                                <p className="text-sm font-extrabold">
                                    Locked in: {selectedMovie}
                                </p>

                                <button
                                    type="button"
                                    className="mt-3 brut-btn bg-[#66d9ff]"
                                    onClick={handleChangeVote}
                                    disabled={isSubmitting}
                                >
                                    Change Vote
                                </button>
                            </div>
                        )}
                        
                        <p className="mt-4 text-xs text-center opacity-80">
                            You can vote once. Voting closes on Day 6.
                        </p>
                    </>
                )}

                { phase === "closed" && (
                    <>
                        <p className="mt-1 font-extrabold">Submissions Closed (Day 6)</p>
                        
                        <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#fff7cc]">
                            <p className="font-bold">
                                Votes are being counted. Come back soon.
                            </p>
                        </div>
                    </>
                )}

                { phase === "winner" && (
                    <>
                        <p className="mt-1 font-extrabold">Winner Announced</p>

                        <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#d7fff0]">
                            <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                                Winner
                            </p>
                            <p className="mt-2 text-xl font-extrabold">
                                {winnerMovie ?? "TBD"}
                            </p>

                            <div className="mt-4 grid gap-1">
                                <p className="font-bold">Meeting:</p>
                                <p>📅 {meeting?.dateText ?? "TBD"}</p>
                                <p>📍 {meeting?.placeText ?? "TBD"}</p>
                            </div>

                            {rsvpError && (
                                <p role="alert" className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-[#ffd6d6]">
                                    {rsvpError}
                                </p>
                            )}

                            {rsvpStatus && (
                                <p className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-white">
                                    RSVP: {rsvpStatus === "yes" ? "I am in ✅" : "Can not make it ❌"}
                                </p>
                            )}

                            <div className="mt-5 grid gap-3">
                                <button
                                    type="button"
                                    className="brut-btn bg-[#b8ff66]"
                                    onClick={() => submitRSVP("yes")}
                                    disabled={rsvpSubmitting}
                                >
                                    {rsvpSubmitting ? "Saving..." : "RSVP: I am in"}
                                </button>

                                <button
                                    type="button"
                                    className="brut-btn bg-white"
                                    onClick={() => submitRSVP("no")}
                                    disabled={rsvpSubmitting}
                                >
                                    {rsvpSubmitting ? "Saving..." : "RSVP: Can not make it"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}