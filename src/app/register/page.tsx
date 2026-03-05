import AuthCard from "@/components/AuthCard";

type RegisterPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: RegisterPageProps) {
    const sp = props.searchParams ? await props.searchParams : {};
    const tokenRaw = sp["token"];
    const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw ?? "";

    return (
        <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
            <AuthCard defaultMode="register" inviteToken={token} />
        </main>
    );
}