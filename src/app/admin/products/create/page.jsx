"use client";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const TYPES = ["UMKM", "Perusahaan", "Sekolah"];

export default function CreateProductPage() {
    const { setSidebarOpen } = useSidebar();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        type: "",
        featuresText: "", // 1 fitur per baris atau pisahkan koma
        is_active: true,
    });

    function toFeaturesArray(text) {
        // pecah per baris, atau koma, trim yang kosong
        return text
            .split(/\r?\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.title) return alert("Title wajib diisi");
        if (!form.type) return alert("Type wajib dipilih");

        setSaving(true);
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: form.title,
                description: form.description,
                price: form.price,
                type: form.type, // enum di DB
                features: toFeaturesArray(form.featuresText),
                is_active: form.is_active,
            }),
        });

        const json = await res.json();
        setSaving(false);

        if (json?.error) {
            Swal.fire({
                icon: "error",
                title: "Gagal Membuat Product",
                text: json.error
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Product Berhasil Dibuat!",
                timer: 1500,
                showConfirmButton: false
            });
            router.push("/admin/products"); // arahkan kembali ke listing
        }
    }

    return (
        <>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 transition-colors">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                            <Menu className="w-6 h-6" />
                        </button>
                        <nav className="text-sm text-gray-500 dark:text-gray-400">
                            <span>Admin</span>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 dark:text-gray-200 font-medium">Create Product</span>
                        </nav>
                    </div>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600">
                        <ChevronLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>
            </header>

            {/* Form */}
            <main className="p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-8 transition-colors">
                    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder="Contoh: Paket UMKM Starter"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder="Jelaskan paketnya..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (text)</label>
                                <input
                                    value={form.price}
                                    onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                    placeholder="Rp 750.000"
                                />
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
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Features (satu per baris / koma)</label>
                            <textarea
                                rows={4}
                                value={form.featuresText}
                                onChange={(e) => setForm((s) => ({ ...s, featuresText: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder={`Contoh:\nLanding page\nForm WhatsApp\nSEO basic`}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))}
                            />
                            <label htmlFor="is_active" className="text-sm">Aktif</label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
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
