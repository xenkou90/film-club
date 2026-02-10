"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function AuthCard() {
    const [mode, setMode] = useState<Mode>("login");

    return (
        <div>
            <h1>{mode === "login" ? "Login" : "Register"}</h1>

            <button type="button" onClick={() => setMode("login")}>
                Login
            </button>

            <button type="button" onClick={() => setMode("register")}>
                Register
            </button>
        </div>
    );
}