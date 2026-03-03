import { pgTable, text, timestamp, serial, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const rounds = pgTable("rounds", {
    id: text("id").primaryKey(), // e.g. "may-2026"
    roundTitle: text("round_title").notNull(),
    themeTitle: text("theme_title").notNull(),
    themeName: text("theme_name").notNull(),
    phase: text("phase").notNull(), // "voting" | "closed" | "winner"
    movies: jsonb("movies").$type<string[]>().notNull(),
    winnerMovie: text("winner_movie"),
    meetingDateText: text("meeting_date_text"),
    meetingPlaceText: text("meeting_place_text"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const votes = pgTable(
    "votes",
    {
        id: serial("id").primaryKey(),
        roundId: text("round_id").notNull(),
        userId: text("user_id").notNull(),
        movie: text("movie").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (t) => ({
        uniqVotePerUser: uniqueIndex("votes_round_user_unique").on(t.roundId, t.userId),
    })
);

export const rsvps = pgTable(
    "rsvps",
    {
        id: serial("id").primaryKey(),
        roundId: text("round_id").notNull(),
        userId: text("user_id").notNull(),
        status: text("status").notNull(), // "yes" | "no"
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (t) => ({
        uniqRSVPPerUser: uniqueIndex("rsvps_round_user_unique").on(t.roundId, t.userId),
    })
);

export const users = pgTable("users", {
    id: text("id").primaryKey(), // Use crypto.randomUUID()
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invites = pgTable("invites", {
    id: serial("id").primaryKey(),
    token: text("token").notNull().unique(), // the value in the invite URL
    createdAt: timestamp("created_at").notNull().defaultNow(),
    usedAt: timestamp("used_at"),  // null = not yet used
    usedBy: text("used_by"),  // email of who registered with it
});