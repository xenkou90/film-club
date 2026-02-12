"use client";

import { useState, useEffect } from "react";

type Mode = "login" | "register";

export default function AuthCard() {
    const [mode, setMode] = useState<Mode>("login");

    // Login state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Register state
    const[registerEmail, setRegisterEmail] = useState("");
    const[registerPassword, setRegisterPassword] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        setEmail("");
        setPassword("");

        setRegisterEmail("");
        setRegisterPassword("");
        setConfirmPassword("");
    }, [mode]);

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log("Submitting login:");
        console.log("Email:", email);
        console.log("Password:", password);
    };

    const handleRegisterSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (registerPassword !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        console.log("Submitting register:");
        console.log("Email:", registerEmail);
        console.log("Password:", registerPassword);
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
                <form onSubmit={handleRegisterSubmit}>
                    <p>Register form</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    
                    <button type="submit">Create account</button>
                </form>
            )}
        </div>
    );
}