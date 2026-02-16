type Phase = "voting" | "closed" | "winner";

type RoundCardProps = {
    roundTitle: string;
    themeTitle: string;
    themeName: string;
    phase: Phase;
    movies: string[];
    winnerMovie: string;
    meeting?: {
        dateText: string;
        placeText: string;
    };
};

export default function RoundCard(props: RoundCardProps) {
    const { roundTitle, themeTitle, themeName, phase, movies, winnerMovie, meeting } =
        props;

    return (
        <div className="brut-card w-full">
            <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                {roundTitle}
            </p>

            <h1 className="mt-2 text-2xl font-extrabold leading-tight">{themeTitle}</h1>

            <p className="mt-2 font-bold">{themeName}</p>

            <div className="mt-6">
                <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
                    Phase
                </p>

                {phase === "voting" && (
                    <>
                        <p className="mt-1 font-extrabold">Voting Open (Day 1-5)</p>
                        
                        <div className="mt-4 grid gap-3">
                            {movies.map((title) => (
                                <button key={title} type="button" className="brut-btn bg-white">
                                    Vote: {title}
                                </button>
                            ))}
                        </div>
                        
                        <p className="mt-4 text-xs opacity-80">
                            You can vote once. Voting closes on Day 6.
                        </p>
                    </>
                )}

                { phase === "closed" && (
                    <>
                        <p className="mt-1 font-extrabold">Submissions Closed (Day 6)</p>
                        
                        <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#fff7cc]">
                            <p className="font-bold">
                                Votes are being counted. Come back soon.
                            </p>
                        </div>
                    </>
                )}

                { phase === "winner" && (
                    <>
                        <p className="mt-1 font-extrabold">Winner Announced</p>

                        <div className="mt-4 border-[3px] border-black rounded-xl p-4 bg-[#d7fff0]">
                            <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                                Winner
                            </p>
                            <p className="mt-2 text-xl font-extrabold">
                                {winnerMovie ?? "TBD"}
                            </p>

                            <div className="mt-4 grid gap-1">
                                <p className="font-bold">Meeting:</p>
                                <p>📅 {meeting?.dateText ?? "TBD"}</p>
                                <p>📍 {meeting?.placeText ?? "TBD"}</p>
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
    );
}