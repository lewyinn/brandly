"use client";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, UploadCloud, CheckCircle, User, } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { signOutAction } from "../login/actions";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Swal from "sweetalert2";

export default function AdminProfile() {
    const { setSidebarOpen } = useSidebar();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [_, logoutAction] = useActionState(signOutAction, null);
    const dropdownRef = useRef(null);
    const [me, setMe] = useState(null);
    const [profile, setProfile] = useState(null);
    const defaultImage =
        profile?.logo_url ||
        "https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found";
    const [preview, setPreview] = useState(null);

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

    async function load() {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        const data = await res.json();
        setProfile(data);
    }

    useEffect(() => { load(); }, []);

    async function save(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const logoFile = fd.get('logo');
        if (logoFile && logoFile.size > 0) {
            const logoFd = new FormData();
            logoFd.append('file', logoFile);
            const up = await fetch('/api/upload-logo', { method: 'POST', body: logoFd });
            const { url, error } = await up.json();
            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Upload Logo",
                    text: error
                });
                return;
            }
            fd.set('logo_url', url);
        }

        const body = {
            logo_url: fd.get('logo_url') || profile?.logo_url || null,
            title: fd.get('title'),
            subtitle: fd.get('subtitle'),
            description: fd.get('description'),
            whatsapp: fd.get('whatsapp'),
            instagram: fd.get('instagram'),
            facebook: fd.get('facebook'),
        };

        try {
            const res = await fetch('/api/profile', { method: 'POST', body: JSON.stringify(body) });
            if (!res.ok) throw new Error("Gagal menyimpan data");

            await load();

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Profil berhasil disimpan",
                timer: 1500,
                showConfirmButton: false
            });

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.message || "Terjadi kesalahan"
            });
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // bikin URL preview
        }
    };

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

            {/* Main Content - Form */}
            <main className="p-6">
                <div className='flex justify-between items-start gap-4 mb-2'>
                    <h1 className="text-2xl font-bold mb-6">Profile Management Content</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-8 transition-colors">
                    <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        <div className="md:col-span-2">
                            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Logo Profil (WAJIB)
                            </label>

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-300">
                                        <label
                                            htmlFor="logo"
                                            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span className="px-4 py-2 text-white">Unggah file</span>
                                            <input
                                                id="logo"
                                                name="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange} // tambahin event handler
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">atau tarik dan lepas</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF hingga 3Mb
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto mt-2">
                                <Image
                                    src={preview || defaultImage}
                                    className="w-20 h-auto object-cover rounded"
                                    width={100}
                                    height={100}
                                    alt="Logo Preview"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                defaultValue={profile?.title || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Masukkan Title"
                            />
                        </div>

                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                SubTitle
                            </label>
                            <input
                                type="text"
                                id="subtitle"
                                name="subtitle"
                                defaultValue={profile?.subtitle || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Brandly Digital Creative"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                defaultValue={profile?.description || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Deskripsi..."
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Whatsapp
                            </label>
                            <input
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                defaultValue={profile?.whatsapp || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Nomor Whatsapp: 628"
                            />
                        </div>

                        <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                id="instagram"
                                name="instagram"
                                defaultValue={profile?.instagram || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="@username"
                            />
                        </div>

                        <div>
                            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Link Facebook
                            </label>
                            <input
                                type="text"
                                id="facebook"
                                name="facebook"
                                defaultValue={profile?.facebook || ''}
                                className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Link Facebook"
                            />
                        </div>

                        <input type="hidden" name="logo_url" defaultValue={profile?.logo_url || ''} />

                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Simpan
                                <CheckCircle className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}