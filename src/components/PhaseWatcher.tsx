"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Phase } from "@/lib/types";

export default function PhaseWatcher({
    roundId,
    phase,
    intervalMs = 8000,
}: {
    roundId: string;
    phase: Phase;
    intervalMs?: number;
}) {
    const router = useRouter();

    useEffect(() => {
        // Only poll while phase is not final
        if (phase === "winner") return;

        const t = setInterval(async () => {
            try {
                const res = await fetch("/api/round", { cache: "no-store" });
                const data = await res.json();

                if (data?.id !== roundId) return;

                // If phase changed on the server, refresh this route
                if (data?.phase && data.phase !== phase) {
                    router.refresh();
                }
            } catch {
                // ignore transient errors
            }
        }, intervalMs);

        return () => clearInterval(t);
    }, [phase, roundId, intervalMs, router]);

    return null;
}