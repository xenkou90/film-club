import AuthCard from "@/components/AuthCard";
import LogoHeader from "@/components/LogoHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <LogoHeader />
        <AuthCard />
      </div>
    </main>
  );
}