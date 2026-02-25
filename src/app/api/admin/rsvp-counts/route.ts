import { NextResponse } from "next/server";
import { round, computeRSVPCounts } from "@/lib/store";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const key = searchParams.get("key") ?? "";
    const roundId = searchParams.get("roundId") ?? "";

    const expectedKey = process.env.ADMIN_KEY ?? "";

    if (!expectedKey || key !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!roundId) {
        return NextResponse.json({ error: "roundId is required" }, { status: 400 });
    }

    if (roundId !== round.id) {
        return NextResponse.json({ error: "Unknown round" }, { status: 404 });
    }

    const counts = computeRSVPCounts(roundId);

    return NextResponse.json({ ok: true, roundId, counts });
}