import RoundCard from "@/components/RoundCard";

type AdminPageProps = {
    searchParams?: { key?: string};
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const adminKey = searchParams?.key ?? "";
    const expectedKey = process.env.ADMIN_KEY ?? "";

    const allowed = expectedKey.length > 0 && adminKey === expectedKey;

    if (!allowed) {
        return (
            <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
                <section className="w-full max-w-md">
                    <div className="brut-card w-full">
                        <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                            Admin
                        </p>
                        <h1 className="mt-2 text-2xl font-extrabold leading-tight">
                            Access denied
                        </h1>
                        <p className="mt-3 font-bold">
                            This page is for the captain only.
                        </p>
                        <p className="mt-3 text-sm opacity-90">
                            Use: <span className="font-extrabold">/admin?key=YOUR_ADMIN_KEY</span>
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    // For now: just show a placeholder admin card.
    // Next step will add controls + admin API calls.
    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <div className="brut-card w-full">
                    <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                        Captain Panel
                    </p>

                    <h1 className="mt-2 text-2xl font-extrabold leading-tight">
                        Admin Controls
                    </h1>

                    <p className="mt-3 font-bold">
                        ✅ Access granted
                    </p>

                    <div className="mt-6 grid gap-3">
                        <button type="button" className="brut-btn bg-white">
                            Set phase: Voting
                        </button>
                        <button type="button" className="brut-btn bg-white">
                            Set phase: Closed
                        </button>
                        <button type="button" className="brut-btn bg-white">
                            Pick winner (tie → shuffle)
                        </button>
                        <button type="button" className="brut-btn bg-white">
                            Set meeting details
                        </button>
                    </div>

                    <p className="mt-4 text-xs opacity-80">
                        (Next) These buttons will call admin APIs.
                    </p>
                </div>
            </section>
        </main>
    );
}