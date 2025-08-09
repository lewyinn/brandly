"use client";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, CheckCircle, ChevronLeft, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TYPES = ["Website", "Social Media"];

export default function CreatePortfolioPage() {
    const { setSidebarOpen } = useSidebar();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        foto_url: "",
        type: "",
        judul: "",
        deskripsi: "",
        techText: "",
        link_portfolio: "",
    });

    function toArray(text) {
        return text
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);
    }

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // preview lokal
        setPreview(URL.createObjectURL(file));

        // upload ke supabase
        try {
            setUploading(true);
            const supabase = createClient();
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { error } = await supabase.storage
                .from("portfolio") // ganti sesuai nama bucket di Supabase
                .upload(`portfolios/${fileName}`, file);

            if (error) throw error;

            const { data } = supabase.storage
                .from("portfolio")
                .getPublicUrl(`portfolios/${fileName}`);

            setForm((s) => ({ ...s, foto_url: data.publicUrl }));
        } catch (err) {
            alert("Upload gagal: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.judul) return alert("Judul wajib diisi");
        if (!form.type) return alert("Type wajib dipilih");

        setSaving(true);
        const res = await fetch("/api/portfolios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                foto_url: form.foto_url,
                type: form.type,
                judul: form.judul,
                deskripsi: form.deskripsi,
                tech: toArray(form.techText),
                link_portfolio: form.link_portfolio,
            }),
        });

        const json = await res.json();
        setSaving(false);

        if (json?.error) {
            alert(json.error);
        } else {
            alert("Portfolio berhasil dibuat");
            router.push("/admin/portfolio");
        }
    }

    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 transition-colors">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <nav className="text-sm text-gray-500 dark:text-gray-400">
                            <span>Admin</span>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 dark:text-gray-200 font-medium">
                                Create Portfolio
                            </span>
                        </nav>
                    </div>
                    <Link
                        href="/admin/portfolios"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>
            </header>

            <main className="p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-8 transition-colors">
                    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
                        {/* Upload Foto */}
                        <div>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-300">
                                        <label
                                            htmlFor="logo"
                                            className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span className="px-4 py-2 text-white">Unggah file</span>
                                            <input
                                                id="logo"
                                                name="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="sr-only"
                                                disabled={uploading}
                                            />
                                        </label>
                                        <p className="pl-1">atau tarik dan lepas</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF hingga 3Mb
                                    </p>
                                </div>
                            </div>

                            {/* Preview */}
                            {preview && (
                                <div className="mx-auto mt-2">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-20 h-auto object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type *</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            >
                                <option value="">Pilih Type</option>
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Judul *</label>
                            <input
                                value={form.judul}
                                onChange={(e) => setForm((s) => ({ ...s, judul: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder="Contoh: Website UMKM A"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Deskripsi</label>
                            <textarea
                                rows={4}
                                value={form.deskripsi}
                                onChange={(e) => setForm((s) => ({ ...s, deskripsi: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tech Stack (satu per baris / koma)
                            </label>
                            <textarea
                                rows={3}
                                value={form.techText}
                                onChange={(e) => setForm((s) => ({ ...s, techText: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Link Portfolio</label>
                            <input
                                value={form.link_portfolio}
                                onChange={(e) => setForm((s) => ({ ...s, link_portfolio: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
