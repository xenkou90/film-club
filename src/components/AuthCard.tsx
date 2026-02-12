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
        <div>
            <h1>{mode === "login" ? "Login" : "Register"}</h1>

            <div>
                <button type="button" onClick={() => setMode("login")}>Login</button>
                <button type="button" onClick={() => setMode("register")}>Register</button>
            </div> 

            {error && <p role="alert">{error}</p>}

            {mode === "login" && (
                <form onSubmit={handleLoginSubmit}>
                    <p>Login form</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) => updateLogin({ email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={login.password}
                        onChange={(e) => updateLogin({ password: e.target.value })}
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
                        value={register.email}
                        onChange={(e) => updateRegister({ email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={register.password}
                        onChange={(e) => updateRegister({ password: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={register.confirmPassword}
                        onChange={(e) => updateRegister({ confirmPassword: e.target.value })}
                    />
                    
                    <button type="submit">Create account</button>
                </form>
            )}
        </div>
    );
}