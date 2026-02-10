"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function AuthCard() {
    const [mode, setMode] = useState<Mode>("login");

    return (
        <div>
            <h1>{mode === "login" ? "Login" : "Register"}</h1>

            <div>
                <button onClick={() => setMode("login")}>Login</button>
                <button onClick={() => setMode("register")}>Register</button>
            </div>

            {mode === "login" && (
                <form>
                    <p>Login form</p>

                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />

                    <button type="submit">Enter</button>
                </form>
            )}

            {mode === "register" && (
                <form>
                    <p>Register form</p>

                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password" />

                    <button type="submit">Create account</button>
                </form>
            )}
        </div>
    );
}