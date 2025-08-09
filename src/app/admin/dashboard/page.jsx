'use client';
import { useSidebar } from '@/context/SidebarContext';
import { CreditCard, Menu, TrendingUp, UserPlus, Users, User } from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react'
import { signOutAction } from '../login/actions';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function DashboardPage() {
    const { setSidebarOpen } = useSidebar();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [_, logoutAction] = useActionState(signOutAction, null);
    const [me, setMe] = useState(null);

    // Tuturial: Ambil user
    useEffect(() => {
        // ambil user yang sedang login
        const supabase = createClient();
        supabase.auth.getUser().then(({ data, error }) => {
            if (!error) setMe(data.user || null);
        });

        // kalau mau realtime update session (opsional)
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setMe(session?.user ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    const displayName =
        me?.user_metadata?.name ||
        me?.user_metadata?.full_name ||
        me?.user_metadata?.display_name ||
        '';

    // Tuturial: Handle dropdown open/close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const stats = [
        {
            title: "Today's Money",
            value: "$53,000",
            change: "+55%",
            positive: true,
            icon: CreditCard,
        },
        {
            title: "Today's Users",
            value: "2,300",
            change: "+3%",
            positive: true,
            icon: Users,
        },
        {
            title: "New Clients",
            value: "+3,052",
            change: "-2%",
            positive: false,
            icon: UserPlus,
        },
        {
            title: "Total Sales",
            value: "$173,000",
            change: "+5%",
            positive: true,
            icon: TrendingUp,
        },
    ];

    const sp = useSearchParams();

    useEffect(() => {
        if (sp.get("login") === "success") {
            Swal.fire({
                icon: "success",
                title: "Selamat datang!",
                timer: 1200,
                showConfirmButton: false,
            });
        }
    }, [sp]);

    return (
        <>
            {/* Header Content */}
            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 transition-colors">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <nav className="text-sm text-gray-500 dark:text-gray-400">
                                <span>Admin</span>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900 dark:text-gray-200 font-medium">
                                    Dashboard
                                </span>
                            </nav>
                        </div>
                    </div>

                    {/* Dropdown Profile */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="rounded-full w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:ring-2 ring-blue-500 transition">
                            <User className="w-5 h-5" />
                        </button>

                        {/* Dropdown animated */}
                        <div
                            className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out origin-top-right ${dropdownOpen
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                {me && (
                                    <>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName || me.displayName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{displayName || me.email}</p>
                                    </>
                                )}
                            </div>
                            <form action={logoutAction}>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600/10 transition-colors">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0
                                        ? "bg-blue-500"
                                        : index === 1
                                            ? "bg-green-500"
                                            : index === 2
                                                ? "bg-orange-500"
                                                : "bg-red-500"
                                        }`}
                                >
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span
                                    className={`text-sm font-medium ${stat.positive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}