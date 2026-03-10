import Image from "next/image";
import Link from "next/link";

export default function LogoHeader() {
    return (
        <div className="flex flex-col items-center gap-3">
            <Link href="/" aria-label="Go to home">
                <Image
                    src="/logo.png"
                    alt="Film Club Logo"
                    width={2200}
                    height={2200}
                    className="object-contain"
                    priority
                />
            </Link>

            <p className="text-2xl font-black uppercase tracking-widest text-[#1f046e] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Monthly theme. Five picks. One winner.
            </p>
        </div>
    );
}