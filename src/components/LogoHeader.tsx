import Image from "next/image";
import Link from "next/link";

export default function LogoHeader() {
    return (
        <div className="flex flex-col items-center gap-3 w-full">
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

            <p className="text-base font-black uppercase tracking-widest text-black whitespace-nowrap">
                Monthly theme. Five picks. One winner.
            </p>
        </div>
    );
}