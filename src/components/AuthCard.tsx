"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function AuthCard() {
    const [mode, setMode] = useState<Mode>("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log("Submitting login:");
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div>
            <h1>{mode === "login" ? "Login" : "Register"}</h1>

            <div>
                <button type="button" onClick={() => setMode("login")}>Login</button>
                <button type="button" onClick={() => setMode("register")}>Register</button>
            </div> 

            {mode === "login" && (
                <form onSubmit={handleLoginSubmit}>
                    <p>Login form</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

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