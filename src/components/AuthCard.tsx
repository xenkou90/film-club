"use client";

import { useState, useEffect } from "react";

type Mode = "login" | "register";

export default function AuthCard() {
    const [mode, setMode] = useState<Mode>("login");

    const [login, setLogin] = useState({ email: "", password: "" });
    const [register, setRegister] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLogin({ email: "", password: "" });
        setRegister({ email: "", password: "", confirmPassword: "" });
        setError(null);
    }, [mode]);

    const updateLogin = (patch: Partial<typeof login>) => {
        setLogin((prev) => ({ ...prev, ...patch }));
    };

    const updateRegister = (patch: Partial<typeof register>) => {
        setRegister((prev) => ({ ...prev, ...patch }));
    };

    const loginIsValid = login.email.trim() !== "" && login.password.length >= 8;

    const registerIsValid =
        register.email.trim() !== "" &&
        register.password.length >= 8 &&
        register.confirmPassword.length >= 8 &&
        register.password === register.confirmPassword; 

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setError(null);

        console.log("Submitting login:");
        console.log("Email:", login.email);
        console.log("Password:", login.password);
    };

    const handleRegisterSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (register.password !== register.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);

        console.log("Submitting register:");
        console.log("Email:", register.email);
        console.log("Password:", register.password);
    };

    return (
        <section className="w-full max-w-md">
        <div className="brut-card">
            <div className="flex items-start justify-between gap-4">
                </div>
                    <p className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                        Film Club
                    </p>
                    <h1 className="mt-2 text-2xl font-extrabold leading-tight">
                        {mode === "login" ? "Enter the club." : "Join the club."}
                    </h1>
                    <p className="mt-2 text-sm opacity-90">
                        Monthly theme. Five Picks. One winner.
                    </p>
                

            <div className="flex shrink-0 overflow-hidden rounded-lg border-[3px] border-black">
                <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={[
                        "brut-tab",
                        mode === "login" ? "bg-[#1f046e] text-white" : "bg-white text-black",
                    ].join(" ")}
                    aria-pressed={mode === "login"}
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={[
                        "brut-tab",
                        mode === "register" ? "bg-[#1f046e] text-white" : "bg-white text-black",
                    ].join(" ")}
                    aria-pressed={mode === "register"}
                >
                    Register
                </button>
            </div>

            {error && (
                <p 
                    role="alert"
                    className="mt-4 border-[3px] border-black rounded-xl px-3 py-2 font-bold bg-[#ffd6d6]"
                >
                    {error}
                </p>
                )}

            {mode === "login" && (
                <form onSubmit={handleLoginSubmit} className="mt-6 grid gap-4">
                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Email</span>
                        <input
                            className="brut-input"
                            type="email"
                            placeholder="you@club.com"
                            value={login.email}
                            onChange={(e) => updateLogin({ email: e.target.value })}
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Password</span>
                        <input
                            className="brut-input"
                            type="password"
                            placeholder="••••••••"
                            value={login.password}
                            onChange={(e) => updateLogin({ password: e.target.value })}
                        />
                    </label>

                    <button 
                        className="brut-btn bg-[#b8ff66]"
                        type="submit"
                        disabled={!loginIsValid}
                        title={!loginIsValid ? "Email must not be empty and password must be at least 8 characters" : ""}
                    >
                        Enter
                    </button>

                </form>

            )}

            {mode === "register" && (
                <form onSubmit={handleRegisterSubmit} className="mt-6 grid gap-4">
                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Email</span>
                        <input
                            className="brut-input"
                            type="email"
                            placeholder="you@club.com"
                            value={register.email}
                            onChange={(e) => updateRegister({ email: e.target.value })}
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Password</span>
                        <input
                            className="brut-input"
                            type="password"
                            placeholder="Password"
                            value={register.password}
                            onChange={(e) => updateRegister({ password: e.target.value })}
                        />
                    </label>
                    
                    <label className="grid gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Password</span>
                        <input
                            className="brut-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={register.confirmPassword}
                            onChange={(e) => updateRegister({ confirmPassword: e.target.value })}
                        />
                    </label>
                    
                    <button 
                        type="submit"
                        disabled={!registerIsValid}
                        title={!registerIsValid ? "Email must not be empty, password must be at least 8 characters, and passwords must match" : ""}
                    >
                        Create account
                    </button>

                </form>
            )}
        </div>
        </section>
    );
}