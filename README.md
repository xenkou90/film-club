# Film Club

A private, invite-only web app for running a monthly film club with friends. Every month the admin sets a theme, members vote on five picks, and the winner is watched together.

Live at [filmclub.space](https://filmclub.space)

---

## Screenshots

<p float="left">
  <img src="screenshots/login-register.png" />
  <img src="screenshots/voting-winner.png" />
  <img src="screenshots/admin-panel.png" />
</p>

---

## Tech Stack

- **Framework** — Next.js 15 (App Router) with TypeScript
- **Database** — PostgreSQL via Drizzle ORM
- **Authentication** — NextAuth.js v4 (Credentials provider)
- **Email** — Resend
- **Styling** — Tailwind CSS with a neo-brutalism design system
- **Deployment** — Hetzner VPS, Nginx reverse proxy, PM2, Let's Encrypt SSL

---

## Features

**For members:**
- Invite-only registration via single-use token links
- Email and password authentication
- Vote on five films each round with a confirmation dialog
- Change your vote any time while voting is open
- RSVP to the screening after the winner is announced
- Automatic email notifications for every phase change

**For the admin:**
- Full round lifecycle management — voting → closed → winner
- Pick winner automatically (random tiebreak on draws)
- Set meeting date and place
- Generate single-use invite links
- View current round info and live vote counts
- View all registered members
- Create new rounds directly from the panel

---

## Running Locally

**Prerequisites:** Node.js 20+, PostgreSQL

**1. Clone the repo**
```bash
git clone https://github.com/xenkou90/film-club.git
cd film-club
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:
```
DATABASE_URL=postgresql://user:password@localhost:5432/filmclub
CURRENT_ROUND_ID=your-round-id
ADMIN_KEY=your_admin_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

Generate a `NEXTAUTH_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4. Run database migrations**
```bash
npx drizzle-kit migrate
```

**5. Seed the settings table**

Connect to your database and run:
```sql
INSERT INTO settings (key, value) VALUES ('currentRoundId', 'your-round-id');
```

**6. Start the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

The app is deployed on a Hetzner CX23 VPS running Ubuntu 24, with:
- **Nginx** as a reverse proxy
- **PM2** to keep the Next.js process running
- **Let's Encrypt** for SSL via Certbot

After pulling changes on the server:
```bash
npm run build
pm2 restart film-club
```

Run migrations if the schema changed:
```bash
npx drizzle-kit migrate
```

---

## Author

Imagined, Created, Designed by Xeno
