"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

type AuthCardProps = {
    defaultMode?: Mode;
    inviteToken?: string;
};

export default function AuthCard({
    defaultMode= "login",
    inviteToken = "",
}: AuthCardProps) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>(defaultMode);

    const [login, setLogin] = useState({ email: "", password: "" });
    const[register, setRegister] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const loginIsValid =
        login.email.trim() !== "" && login.password.length >= 8;

    const registerIsValid =
        register.email.trim() !== "" &&
        register.password.length >= 8 &&
        register.confirmPassword.length >= 8 &&
        register.password === register.confirmPassword;

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const result = await signIn("credentials", {
                email: login.email.toLowerCase().trim(),
                password: login.password,
                redirect: false, // I handle the redirect myself
            });

            if (result?.error) {
                setError("Invalid email or password");
                return;
            }

            // Succesful login - go to round page
            router.push("/round");
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (register.password !== register.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!inviteToken) {
            setError("Missing invite token. Use the invite link sent to you.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            // Step 1: Create the account
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: register.email.toLowerCase().trim(),
                    password: register.password,
                    token: inviteToken,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error ?? "Registration failed");
                return;
            }

            // Step 2: Automatically sign in after registering
            const result = await signIn("credentials", {
                email: register.email.toLowerCase().trim(),
                password: register.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Account created but login failed. Try logging in manually");
                return;
            }

            // Step 3: Go to round page
            router.push("/round");
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full max-w-md">
            <div className="brut-card w-full">
            <h1 className="mb-4 text-2xl font-extrabold leading-tight text-center">
                {mode === "login" ? "Enter the club." : "Join the club."}
            </h1>

                <div className="flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={[
                            "brut-tab rounded-xl",
                            mode === "login"
                                ? "bg-[#4b004b] text-[#dda0dd]"
                                : "bg-[#2e0854] text-[#dda0dd]",
                        ].join(" ")}
                        aria-pressed={mode === "login"}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("register")}
                        className={[
                            "brut-tab rounded-xl",
                            mode === "register"
                                ? "bg-[#4b004b] text-[#dda0dd]"
                                : "bg-[#2e0854] text-[#dda0dd]",
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
                            <span className="text-xs font-extrabold uppercase tracking-wider">
                                Email
                            </span>
                            <input
                                className="brut-input placeholder:text-gray-400"
                                type="email"
                                placeholder="you@club.com"
                                value={login.email}
                                onChange={(e) => updateLogin({ email: e.target.value })}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider">
                                Password
                            </span>
                            <input
                                className="brut-input placeholder:text-gray-400"
                                type="password"
                                placeholder="••••••••"
                                value={login.password}
                                onChange={(e) => updateLogin({ password: e.target.value })}
                            />
                        </label>

                        <button
                            className="brut-btn bg-[#4b004b] text-[#dda0dd] disabled:bg-[#b266b2] disabled:text-[#2e0854]"
                            type="submit"
                            disabled={!loginIsValid || isSubmitting}
                            title={
                                !loginIsValid
                                    ? "Email must not be empty and password must be at least 8 characters"
                                    : ""
                            }
                        >
                            {isSubmitting ? "Entering..." : "Enter"}
                        </button>
                    </form>
                )}

                {mode === "register" && (
                    <form onSubmit={handleRegisterSubmit} className="mt-6 grid gap-4">
                        <label className="grid gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider">
                                Email
                            </span>
                            <input
                                className="brut-input placeholder:text-gray-400"
                                type="email"
                                placeholder="you@club.com"
                                value={register.email}
                                onChange={(e) => updateRegister({ email: e.target.value })}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider">
                                Password
                            </span>
                            <input
                                className="brut-input placeholder:text-gray-400"
                                type="password"
                                placeholder="Password"
                                value={register.password}
                                onChange={(e) => updateRegister({ password: e.target.value })}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider">
                                Confirm Password
                            </span>
                            <input
                                className="brut-input placeholder:text-gray-400"
                                type="password"
                                placeholder="Confirm Password"
                                value={register.confirmPassword}
                                onChange={(e) =>
                                    updateRegister({ confirmPassword: e.target.value })
                                }
                            />
                        </label>

                        <button
                            type="submit"
                            className="brut-btn bg-[#4b004b] text-[#b266b2] disabled:bg-[#b266b2] disabled:text-[#2e0854]"
                            disabled={!registerIsValid || isSubmitting}
                            title={
                                !registerIsValid
                                    ? "Email must not be empty, password must be at least 8 characters, and passwords must match"
                                    : ""
                            }
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}