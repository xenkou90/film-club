import { NextResponse } from "next/server";
import { db } from "@/db";
import { invites } from "@/db/schema";
import { getSiteUrl } from "@/lib/site-url";

type Body = {
    key?: string;
};

export async function POST(req: Request) {
    let body: Body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_KEY ?? "";
    const providedKey = body.key ?? "";

    if (!expectedKey || providedKey !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique token
    const token = crypto.randomUUID();

    // Store it in the DB
    await db.insert(invites).values({ token });

    // Build the full invite URL
    const inviteUrl = `${getSiteUrl()}/register?token=${token}`;

    return NextResponse.json({ ok: true, inviteUrl });
}