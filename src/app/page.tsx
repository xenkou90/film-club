import AuthCard from "@/components/AuthCard";
import LogoHeader from "@/components/LogoHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2e0854] p-5 flex items-start justify-center pt-8">
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <LogoHeader />
        <AuthCard />
        <p className="text-xs font-bold tracking-widest text-[#dda0dd] opacity-60">
          Imagined, Created, Designed by Xeno
        </p>

      </div>
    </main>
  );
}