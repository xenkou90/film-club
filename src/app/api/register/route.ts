import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, invites } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

type Body = {
    email?: string;
    password?: string;
    token?: string;
};

export async function POST(req: Request) {
    let body: Body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = (body.email ?? "").toLowerCase().trim();
    const password = body.password ?? "";
    const token = (body.token ?? "").trim();

    // Basic validation
    if (!email || !password || !token) {
        return NextResponse.json(
            { error: "email, password and token are required" },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters" },
            { status: 400 }
        );
    }

    if (!/\d/.test(password)) {
        return NextResponse.json(
            { error: "Password must contain at least one number" },
            { status: 400 }
        );
    }

    // Check invite token exists and hasn't been used
    const inviteRows = await db
        .select()
        .from(invites)
        .where(eq(invites.token, token))
        .limit(1);

    const invite = inviteRows[0];

    if (!invite) {
        return NextResponse.json(
            { error: "Invalid invite link" },
            { status: 403 }
        );
    }

    if (invite.usedAt) {
        return NextResponse.json(
            { error: "This invite link has already been used" },
            { status: 403 }
        );
    }

    // Check email isn't already registered
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser[0]) {
        return NextResponse.json(
            { error: "An account with this email already exists" },
            {status: 409 }
        );
    }

    // Hash the password - never plain text
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user
    const userId = crypto.randomUUID();

    await db.insert(users).values({
        id: userId,
        email,
        passwordHash,
    });

    //Mark invite as used
    await db
        .update(invites)
        .set({
            usedAt: new Date(),
            usedBy: email,
        })
        .where(eq(invites.token, token));

    // Send welcome email - fire and forget
    sendWelcomeEmail(email).catch(console.error);

    return NextResponse.json({ ok: true });
}