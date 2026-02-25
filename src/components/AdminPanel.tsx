"use client";

import { useEffect, useState } from "react";
import type { Phase } from "@/lib/types";

export default function AdminPanel({ adminKey }: { adminKey: string }) {
    const [ status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roundId, setRoundId] = useState<string | null>(null);
    const [meetingDateText, setMeetingDateText] = useState("");
    const [meetingPlaceText, setMeetingPlaceText] = useState("");

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
                    onClick={() => setPhase("voting")}
                    disabled={isSubmitting}
                >
                    Set Phase: Voting
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPhase("closed")}
                    disabled={isSubmitting}
                >
                    Set Phase: Closed
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={pickWinner}
                    disabled={isSubmitting || !roundId}
                    title={!roundId ? "Loading round..." : ""}
                >
                    Pick winner (tie → shuffle)
                </button>

                <button
                    type="button"
                    className="brut-btn bg-white"
                    onClick={() => setPhase("winner")}
                    disabled={isSubmitting}
                >
                    Set Phase: Winner
                </button>
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

            <p className="mt-4 text-xs opacity-80">
                Open /round in another tab and watch it update after refresh.
            </p>
        </div>
    );
}