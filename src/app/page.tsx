import Link from "next/link";
import AuthCard from "@/components/AuthCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#a78bfa] p-5 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <AuthCard />
        <Link
          href="/round"
          className="mt-6 inline-block border-[3px] border-black rounded-xl px-4 py-2 font-extrabold shadow-[6px_6px_0_0_#000] bg-white"
        >
          Go to /round →
        </Link>
      </div>
    </main>
  );
}