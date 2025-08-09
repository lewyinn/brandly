"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction } from "./actions";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60">
            <LogIn className="h-4 w-4" />
            {pending ? "Memproses…" : "Masuk"}
        </button>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(signInAction, null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!state) return;
        if (state.ok === false) {
            Swal.fire({ icon: "error", title: "Login gagal", text: state.message });
        } else if (state.ok === true) {
            Swal.fire({
                icon: "success",
                title: "Berhasil masuk",
                timer: 1200,
                showConfirmButton: false,
            }).then(() => {
                router.push("/admin/dashboard?login=success");
            });
        }
    }, [state, router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
            <div className="mx-auto grid min-h-screen max-w-md place-items-center px-6">
                <form
                    action={formAction}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"
                >
                    {/* Header */}
                    <div className="mb-6 space-y-2 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
                            <span className="text-lg font-bold text-indigo-300">BD</span>
                        </div>
                        <h1 className="text-lg font-semibold text-white">Login Admin</h1>
                        <p className="text-xs text-slate-300/80">
                            Masuk untuk mengelola konten dan data Anda.
                        </p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="mb-1 block text-xs font-medium text-slate-200"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nama@domain.com"
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none ring-0 focus:border-indigo-400/40 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="mb-1 block text-xs font-medium text-slate-200"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </span>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2.5 pr-11 text-sm text-white placeholder:text-slate-400 outline-none ring-0 focus:border-indigo-400/40 focus:bg-white/10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <SubmitButton />

                    {/* Footer kecil */}
                    <p className="mt-4 text-center text-[11px] text-slate-400">
                        Dengan masuk, Anda menyetujui kebijakan privasi kami.
                    </p>
                </form>

                {/* Credit kecil (opsional) */}
                <p className="mt-6 text-center text-[10px] text-slate-500">
                    © {new Date().getFullYear()} Brandly Digital Creative
                </p>
            </div>
        </div>
    );
}
