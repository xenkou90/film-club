export default function RoundPage() {
    return (
        <main className="min-h-screen bg-[@a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <div className="brut-card w-full">
                    <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                        Movie Night #1 - May 2026
                    </p>

                    <h1 className="mt-2 text-2x1 font-extrabold leading-tight">
                        Theme of the month
                    </h1>

                    <p className="mt-2 font-bold">
                        Neon Nights
                    </p>

                    <div className="mt-6">
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
                            Phase
                        </p>
                        <p className="mt-1 font-extrabold">
                            Voting Open (Day 1-5)
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3">
                        {["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"].map(
                            (title) => (
                                <button
                                    key={title}
                                    type="button"
                                    className="brut-btn bg-white"
                                >
                                    {title}
                                </button>
                            )
                        )}
                    </div>

                    <p className="mt-4 text-xs opacity-80">
                        (Placeholder) Later this will submit a vote.
                    </p>
                </div>
            </section>
        </main>
    );
}