"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            type="button"
            className="brut-btn bg-[#4b004b] text-[#fbfcfa]"
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            Log Out
        </button>
    );
}