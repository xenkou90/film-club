CREATE TABLE "rounds" (
	"id" text PRIMARY KEY NOT NULL,
	"round_title" text NOT NULL,
	"theme_title" text NOT NULL,
	"theme_name" text NOT NULL,
	"phase" text NOT NULL,
	"movies" jsonb NOT NULL,
	"winner_movie" text,
	"meeting_date_text" text,
	"meeting_place_text" text,
	"creatred_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_id" text NOT NULL,
	"user_id" text NOT NULL,
	"movie" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "rsvps_round_user_unique" ON "rsvps" USING btree ("round_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_round_user_unique" ON "votes" USING btree ("round_id","user_id");