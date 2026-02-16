type Phase = "voting" | "closed" | "winner";

export default function RoundPage() {

    const phase: Phase = "winner";

    const phaseLabel =
        phase === "voting"
            ? "voting Open"
            : phase === "closed"
            ? "Submissions Closed"
            : "Winner Announced";

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
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

                        {phase === "voting" && (
                            <>
                                <p className="mt-1 font-extrabold">Voting Open (Day 1-5)</p>
                                
                                <div className="mt-4 grid gap-3">
                                    {["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"].map(
                                        (title) => (
                                            <button key={title} type="button" className="brut-btn bg-white">
                                                Vote: {title}
                                            </button>
                                        )    
                                    )}
                                </div>

                                <p className="mt-4 text-xs opacity-80">
                                    You can vote once. Voting closes on Day 6.
                                </p>
                            </>
                        )}

                        {phase === "closed" && (
                            <>
                                <p className="mt-1 font-extrabold">Submissions Closed (Day 6)</p>

                                <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#fff7cc]">
                                    <p className="font-bold">
                                        Votes are being counted. Come back soon.
                                    </p>
                                </div>
                            </>
                        )}

                        {phase === "winner" && (
                            <>
                                <p className="mt-1 font-extrabold">Winner Announced!</p>

                                <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#d7fff0]">
                                    <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                                        Winner
                                    </p>
                                    <p className="mt-2 text-xl font-extrabold">Movie 3</p>

                                    <div className="mt-4 grid gap-1">
                                        <p className="font-bold">Meeting:</p>
                                        <p>May 24, 20:00</p>
                                        <p>You know where to meet!</p>
                                    </div>

                                    <div className="mt-5 grid gap-3">
                                        <button type="button" className="brut-btn bg-[#b8ff66]">
                                            RSVP: I'm in!
                                        </button>
                                        <button type="button" className="brut-btn bg-white">
                                            RSVP: Can't make it.
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}