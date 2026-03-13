"use client";

import { useEffect, useState } from "react";
import type { Phase } from "@/lib/types";

export default function AdminPanel({ adminKey }: { adminKey: string }) {
    const [ status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roundId, setRoundId] = useState<string | null>(null);
    const [meetingDateText, setMeetingDateText] = useState("");
    const [meetingPlaceText, setMeetingPlaceText] = useState("");
    const [rsvpCounts, setRsvpCounts] = useState<{ yes: number; no: number; total: number } | null>(null);
    const [pendingAction, setPendingAction] = useState<null | {
        label: string;
        run: () => void;
    }>(null);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [newRound, setNewRound] = useState({
        id: "",
        roundTitle: "",
        themeTitle: "",
        themeName: "",
        movies: ["", "", "", "", ""],
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/round", { cache: "no-store" });
                const data = await res.json();
                setRoundId(data.id ?? null);
            } catch {
                setRoundId(null);
            }
        })();
    }, []);

    useEffect(() => {
        if (!roundId) return;
        refreshRSVPCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roundId]);

    async function setPhase(phase: Phase) {
        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("/api/admin/phase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: adminKey, phase }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to set phase");
                return;
            }

            setStatus(`Phase set to: ${phase}`);
        } catch {
            setStatus("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function pickWinner() {
        if (!roundId) {
            setStatus("Missing roundId. Refresh and try again");
            return;
        }

        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("/api/admin/pick-winner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: adminKey, roundId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to pick winner");
                return;
            }

            // Example status message:
            // If it was a tie, data.tied will have multiple movies 
            const tieNote =
                Array.isArray(data.tied) && data.tied.length > 1
                    ? ` (tie between: ${data.tied.join(", ")})`
                    : "";
            
            setStatus(`Winner picked: ${data.winner}${tieNote}`);
        } catch {
            setStatus("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function refreshRSVPCounts() {
        if (!roundId) return;

        try {
            const res = await fetch(
                `/api/admin/rsvp-counts?roundId=${encodeURIComponent(roundId)}&key=${encodeURIComponent(adminKey)}`,
                { cache: "no-store"}
            );

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to fetch RSVP totals");
                return;
            }

            setRsvpCounts(data.counts ?? null);
        } catch {
            setStatus("Network error fetching RSVP totals");
        }
    }

    async function saveMeeting() {
        if (!roundId) {
            setStatus("Missing roundId. Refresh and try again.");
            return;
        }

        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("/api/admin/meeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: adminKey,
                    roundId,
                    dateText: meetingDateText,
                    placeText: meetingPlaceText,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to save meeting");
                return;
            }

            setStatus("Meeting details saved");
        } catch {
            setStatus("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function generateInvite() {
        setIsSubmitting(true);
        setStatus(null);
        setInviteUrl(null);

        try {
            const res = await fetch("/api/admin/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: adminKey }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to generater invite");
                return;
            }

            setInviteUrl(data.inviteUrl);
        } catch {
            setStatus("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function copyInviteUrl() {
        if (!inviteUrl) return;
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function createRound() {
        // Validate all fields are filled before sending
        if (
            !newRound.id ||
            !newRound.roundTitle ||
            !newRound.themeTitle ||
            !newRound.themeName ||
            newRound.movies.some((m) => m.trim() === "")
        ) {
            setStatus("All fields are required including all 5 movies");
            return;
        }

        setIsSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("/api/admin/create-round", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: adminKey,
                    id: newRound.id.trim(),
                    roundTitle: newRound.roundTitle.trim(),
                    themeTitle: newRound.themeTitle.trim(),
                    themeName: newRound.themeName.trim(),
                    movies: newRound.movies.map((m) => m.trim()),
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus(data?.error ?? "Failed to create round");
                return;
            }

            setStatus(`Round "${newRound.id}" created and set as active`);

            // Reset the form after successful creation
            setNewRound({
                id: "",
                roundTitle: "",
                themeTitle: "",
                themeName: "",
                movies: ["", "", "", "", ""],
            });

            // Refresh the roundId in state so other actions use the new round
            setRoundId(newRound.id.trim());
        
        } catch {
            setStatus("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateMovie(index: number, value: string) {
        setNewRound((prev) => {
            const movies = [...prev.movies];
            movies[index] = value;
            return { ...prev, movies };
        });
    }

    return (
        <div className="brut-card w-full">
            <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                Captain Panel
            </p>

            <h1 className="mt-2 text-2xl font-extrabold leading-tight">
                Admin Controls
            </h1>

            {status && (
                <p className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-white">
                    {status}
                </p>
            )}

            <div className="mt-6 grid gap-3">
                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPendingAction({ label: "Set phase to VOTING?", run: () => setPhase("voting") })}
                    disabled={isSubmitting || !!pendingAction}
                >
                    Set Phase: Voting
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPendingAction({ label: "Set phase to CLOSED?", run: () => setPhase("closed") })}
                    disabled={isSubmitting || !!pendingAction}
                >
                    Set Phase: Closed
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPendingAction({ label: "Pick winner now?", run: pickWinner })}
                    disabled={isSubmitting || !roundId || !!pendingAction}
                    title={!roundId ? "Loading round..." : ""}
                >
                    Pick winner (tie → shuffle)
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPendingAction({ label: "Set phase to WINNER?", run: () => setPhase("winner") })}
                    disabled={isSubmitting || !!pendingAction}
                >
                    Set phase: Winner
                </button>

                {pendingAction && (
                    <div className="border-[3px] border-black rounded-xl p-4 bg-[#fff7cc] grid gap-3">
                        <p className="font-extrabold">{pendingAction.label}</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="brut-btn bg-[#1f046e] text-white flex-1"
                                onClick={() => {
                                    pendingAction.run();
                                    setPendingAction(null);
                                }}
                                disabled={isSubmitting}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="brut-btn bg-white flex-1"
                                onClick={() => setPendingAction(null)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 grid gap-3">
                <label className="grid gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                        Meeting date/time
                    </span>
                    <input
                        className="brut-input"
                        placeholder="May 24, 20:30"
                        value={meetingDateText}
                        onChange={(e) => setMeetingDateText(e.target.value)}
                        disabled={isSubmitting}
                    />
                </label>

                <label className="grid gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                        Meeting Place
                    </span>
                    <input
                        className="brut-input"
                        placeholder="You know where!"
                        value={meetingPlaceText}
                        onChange={(e) => setMeetingPlaceText(e.target.value)}
                        disabled={isSubmitting}
                    />
                </label>

                <button
                    type="button"
                    className="brut-btn bg-[#b8ff66]"
                    onClick={saveMeeting}
                    disabled={isSubmitting || !roundId}
                >
                    Save meeting details
                </button>
            </div>

            <div className="mt-6 border-[3px] border-black rounded-xl p-4 bg-white">
                <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                    RSVP totals
                </p>

                {rsvpCounts ? (
                    <div className="mt-2 grid gap-1 font-bold">
                        <p>✅ Yes: {rsvpCounts.yes}</p>
                        <p>❌ No: {rsvpCounts.no}</p>
                        <p>👥 Total replies: {rsvpCounts.total}</p>
                    </div>
                ) : (
                    <p className="mt-2 font-bold opacity-80">No RSVP data yet.</p>
                )}

                <button
                    type="button"
                    className="mt-4 brut-btn bg-[#66d9ff]"
                    onClick={refreshRSVPCounts}
                    disabled={isSubmitting || !roundId}
                >
                    Refresh RSVP totals
                </button>
            </div>

            <p className="mt-4 text-xs opacity-80">
                Open /round in another tab and watch it update after refresh.
            </p>

            <div className="mt-6 border-[3px] border-black rounded-xl p-4 bg-white">
                <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                    Invite a member
                </p>

                <p className="mt-2 text-sm font-bold opacity-80">
                    Generate a single-use invite link. Send it to one friend.
                </p>

                <button
                    type="button"
                    className="mt-3 brut-btn bg-[#b8ff66]"
                    onClick={() => setPendingAction({
                        label: "Generate a new invite link?",
                        run: generateInvite,
                    })}
                    disabled={isSubmitting || !!pendingAction}
                >
                    Generate invite link
                </button>

                {inviteUrl && (
                    <div className="mt-4 grid gap-2">
                        <p className="text-xs font-extrabold uppercase tracking-wider">
                            Invite link - share once
                        </p>

                        <p className="break-all rounded-lg border-[3px] border-black px-3 py-2 text-sm font-bold bg-[#f3f0ff]">
                            {inviteUrl}
                        </p>

                        <button
                            type="button"
                            className="brut-btn bg-[#66d9ff]"
                            onClick={copyInviteUrl}
                        >
                            {copied ? "Copied! ✅" : "Copy link"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 border-[3px] border-black rounded-xl p-4 bg-white">
                <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                    Create new round
                </p>

                <div className="mt-4 grid gap-3">
                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                            Round ID
                        </span>
                        <input
                            className="brut-input"
                            placeholder="june-2026"
                            value={newRound.id}
                            onChange={(e) => setNewRound((prev) => ({ ...prev, id: e.target.value }))}
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                            Round Title
                        </span>
                        <input
                            className="brut-input"
                            placeholder="Movie Night #2 - June 2026"
                            value={newRound.roundTitle}
                            onChange={(e) => setNewRound((prev) => ({ ...prev, roundTitle: e.target.value }))}
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                            Theme Title
                        </span>
                        <input
                            className="brut-input"
                            placeholder="Directors Cut"
                            value={newRound.themeTitle}
                            onChange={(e) => setNewRound((prev) => ({ ...prev, themeTitle: e.target.value }))}
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                            Theme Description
                        </span>
                        <input
                            className="brut-input"
                            placeholder="Films where the director..."
                            value={newRound.themeName}
                            onChange={(e) => setNewRound((prev) => ({ ...prev, themeName: e.target.value }))}
                            disabled={isSubmitting}
                        />
                    </label>

                    <p className="text-xs font-extrabold uppercase tracking-wider mt-2">
                        Movies (exactly 5)
                    </p>

                    {newRound.movies.map((movie, index) => (
                        <input
                            key={index}
                            className="brut-input"
                            placeholder={`Movie ${index + 1}`}
                            value={movie}
                            onChange={(e) => updateMovie(index, e.target.value)}
                            disabled={isSubmitting}
                        />
                    ))}

                    <button
                        type="button"
                        className="brut-btn bg-[#b8ff66]"
                        onClick={() => setPendingAction({
                            label: `Create round "${newRound.id}" and set as active?`,
                            run: createRound,
                        })}
                        disabled={isSubmitting || !!pendingAction}
                        title={!!pendingAction ? "Confirm or cancel the pending action above first" : ""}
                    >
                        Create round
                    </button>
                </div>
            </div>
        </div>
    );
}