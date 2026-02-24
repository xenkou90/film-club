import AdminPanel from "@/components/AdminPanel";
import RoundCard from "@/components/RoundCard";

type AdminPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Adminpage(props: AdminPageProps) {
    const sp = props.searchParams ? await props.searchParams : {};
    const adminKeyRaw = sp["key"];
    const adminKey = Array.isArray(adminKeyRaw) ? adminKeyRaw[0] : adminKeyRaw ?? "";


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

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <section className="w-full max-w-md">
                <AdminPanel adminKey={adminKey} />
            </section>
        </main>
    );
}