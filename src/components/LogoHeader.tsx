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

        <div style={{ backgroundColor: '#800080', border: '3px solid black', borderRadius: '12px', boxShadow: '6px 6px 0 0  #000', padding: '8px 20px' }}>
            <p className="text-base font-black upprcase tracking-widest text-[#dda0dd] whitespace-nowrap">
                Monthly theme. Five picks. One winner.
            </p>
        </div>
        </div>
    );
}