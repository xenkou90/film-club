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

    useEffect(() => {
        setLogin({ email: "", password: ""});
        setRegister({ email: "", password: "", confirmPassword: ""});
    }, [mode]);

    const handleLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log("Submitting login:");
        console.log("Email:", login.email);
        console.log("Password:", login.password);
    };

    const handleRegisterSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (register.password !== register.confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

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

            {mode === "login" && (
                <form onSubmit={handleLoginSubmit}>
                    <p>Login form</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) => setLogin({ ...login, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={login.password}
                        onChange={(e) => setLogin({ ...login, password: e.target.value })}
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
                        onChange={(e) => setRegister({ ...register, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={register.password}
                        onChange={(e) => setRegister({ ...register, password: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={register.confirmPassword}
                        onChange={(e) => setRegister({ ...register, confirmPassword: e.target.value })}
                    />
                    
                    <button type="submit">Create account</button>
                </form>
            )}
        </div>
    );
}