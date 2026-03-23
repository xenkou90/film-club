import AuthCard from "@/components/AuthCard";
import LogoHeader from "@/components/LogoHeader";

type RegisterPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: RegisterPageProps) {
    const sp = props.searchParams ? await props.searchParams : {};
    const tokenRaw = sp["token"];
    const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw ?? "";

    return (
        <main className="min-h-screen bg-[#2e0854] p-5 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <LogoHeader />
                <AuthCard defaultMode="register" inviteToken={token} />
            </div>
        </main>
    );
}