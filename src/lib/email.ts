import { Resend } from "resend";
import { db } from "@/db";
import { users } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fetch all member emails from the DB
async function getAllMemberEmails(): Promise<string[]> {
    const rows = await db.select({ email: users.email }).from(users);
    return rows.map((r) => r.email);
}

export async function sendVotingOpenEmail(roundTitle: string) {
    const emails = await getAllMemberEmails();
    if (emails.length === 0) return;

    await resend.emails.send({
        from: "Film Club <onboarding@resend.dev>",
        to: emails,
        subject: `🎬 Voting is open — ${roundTitle}`,
        html: `
            <div style="font-family: monospace; max-width: 480px;margin: 0 auto; padding: 24px; border: 3px solid black;">
                <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 12px;">Voting is open.</h1>
                <p style="font-weight: bold; margin: 0 0 8px;">${roundTitle}</p>
                <p style="margin: 0 0 24px;">Head to Film Club and cast your vote. You have until Day 6.</p>
                <a
                    href="${process.env.NEXT_PUBLIC_SITE_URL}/round"
                    style="display: inline block; background: #b8ff66; border: 3px solid black; padding: 12px 24px; font-weight: 900; text-decoration: none; color: black;"
                >
                    Vote now →
                </a>
            </div>
        `,
    });
}

export async function sendVotingClosedEmail(roundTitle: string) {
    const emails = await getAllMemberEmails();
    if (emails.length === 0) return;

    await resend.emails.send({
        from: "Film Club <onboarding@resend.dev>",
        to: emails,
        subject: `🔒 Voting closed — ${roundTitle}`,
        html: `
            <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px; border: 3px solid black;">
                <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 12px;">Voting is closed.</h1>
                <p style="font-weight: bold; margin: 0 0 8px;">${roundTitle}</p>
                <p style="margin: 0 0 24px;">Votes are being counted. The winner will be announced soon.</p>
            </div>
        `,
    });
}

export async function sendWinnerEmail(
    roundTitle: string,
    winnerMovie: string,
    meeting?: { dateText: string; placeText: string }
) {
    const emails = await getAllMemberEmails();
    if (emails.length === 0) return;

    const meetingBlock = meeting
        ? `
            <div style="margin: 24px 0; padding: 16px; border: 3px solid black; background: #d7fff0;">
                <p style="font-weight: 900; margin: 0 0 8px;">Meeting details</p>
                <p style="margin: 0 0 4px;">📅 ${meeting.dateText}</p>
                <p style="margin: 0;">📍 ${meeting.placeText}</p>
            </div>
        `
        : `<p style="margin: 24px 0; font-weight: bold;">Meeting details coming soon.</p>`;
    
    await resend.emails.send({
        from: "Film Club <onboarding@resend.dev>",
        to: emails,
        subject: `🏆 Winner: ${winnerMovie} — ${roundTitle}`,
        html: `
            <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px; border: 3px solid black;">
                <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 12px;">We have a winner.</h1>
                <p style="font-weight: bold; margin: 0 0 8px;">${roundTitle}</p>
                <div style="margin: 24px 0; padding: 16px; border: 3px solid black; background: #f3f0ff;">
                    <p style="font-size: 20px; font-weight: 900; margin: 0;">🎬 ${winnerMovie}</p>
                </div>
                ${meetingBlock}
                <a 
                    href="${process.env.NEXT_PUBLIC_SITE_URL}/round"
                    style="display: inline-block; background: #b8ff66; border: 3px solid black; padding: 12px 24px; font-weight: 900; text-decoration: none; color: black;"
                >
                    RSVP now →
                </a>
            </div>
        `,
    });
}

export async function sendWelcomeEmail(email: string) {
    await resend.emails.send({
        from: "Film Club <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Film Club 🎬",
        html: `
            <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px; border: 3px; solid black;">
                <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 12px;">You're in.</h1>
                <p style="margin: 0 0 24px; font-weight: bold;">Welcome to Film Club. Every month we pick a theme, vote on five films and watch the winner together.</p>
                <a 
                    href="${process.env.NEXT_PUBLIC_SITE_URL}/round"
                    style="display: inline-block; background: #b8ff66; border: 3px solid black; padding: 12px 24px; font-weight: 900; text-decoration: none; color: black;"
                >
                    Go to Film Club →
                </a>
            </div>
        `,
    });
}