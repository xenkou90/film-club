"use client";

import { useState } from "react";
import type { Phase } from "@/lib/types";

export default function AdminPanel({ adminKey }: { adminKey: string }) {
    const [ status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    onClick={() => setPhase("winner")}
                    disabled={isSubmitting}
                >
                    Set Phase: Winner
                </button>
            </div>

            <p className="mt-4 text-xs opacity-80">
                Open /round in another tab and watch it update after refresh.
            </p>
        </div>
    );
}