'use client';
import { useSidebar } from '@/context/SidebarContext';
import { Home, Users, CreditCard, X, User, LogIn, UserPlus, Settings, ArrowUp, ArrowDown, FolderCode } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaProjectDiagram } from 'react-icons/fa';

export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
    const [darkMode, setDarkMode] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [darkMode]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setDarkMode(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const isActive = (path) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-24 px-6">
                    <div className="flex items-center space-x-4">
                        <div className="px-2 py-2 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold"> ADMIN DASHBOARD</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-6 px-6 space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        MAIN NAVIGATION
                    </h3>

                    <Link href="/admin/dashboard"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')
                            ? "bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link href="/admin/profile"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/profile')
                            ? "bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </Link>

                    <Link href="/admin/products"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products')
                            ? "bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                        <FolderCode className="w-5 h-5" />
                        <span className="font-medium">Products</span>
                    </Link>

                    <Link href="/admin/portfolio"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/portfolio')
                            ? "bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                        <FaProjectDiagram className="w-5 h-5" />
                        <span className="font-medium">Portfolio</span>
                    </Link>

                    {/* Dropdown Settings */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="flex items-center space-x-3">
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Settings</span>
                            </span>
                            <span className="text-sm">{settingsOpen ? <ArrowUp className='w-4 h-4' /> : <ArrowDown className='w-4 h-4' /> }</span>
                        </button>

                        <div
                            className={`ml-7 overflow-hidden transition-all duration-300 ease-in-out
                                ${settingsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <Link href="/admin/settings/general"
                                className={`block px-2 py-2 rounded-md text-sm transition-colors ${isActive('/admin/settings/general')
                                    ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                General
                            </Link>
                            <Link href="/admin/settings/security"
                                className={`block px-2 py-2 rounded-md text-sm transition-colors ${isActive('/admin/settings/security')
                                    ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                Security
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {darkMode ? "🌞 Light" : "🌙 Dark"}
                    </button>
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}></div>
            )}
        </>
    );
}