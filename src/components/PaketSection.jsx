"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight, FaSchool, FaBuilding, FaStore } from "react-icons/fa";
import { motion } from "framer-motion";

const TYPE_MAP = {
    website: "Website",
    sosmed: "Sosial Media",
};

const CategoryButton = ({ label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${active ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
    >
        {icon}
        {label}
    </button>
);

const PricingCard = ({ plan, highlight, href }) => (
    <div
        className={`relative flex flex-col h-full rounded-2xl border p-6 shadow-lg transition-all duration-300 ${highlight ? "border-blue-500 bg-gray-800" : "border-gray-700 bg-gray-800/70 backdrop-blur-sm"
            }`}
    >
        {highlight && (
            <div className="absolute top-0 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                Paling Populer
            </div>
        )}

        <div className="mb-4">
            <h3 className="text-xl font-bold text-white">{plan.title}</h3>
            {plan.description ? <p className="mt-1 text-gray-400">{plan.description}</p> : null}
        </div>

        <div className="my-4">
            <p className="text-4xl font-extrabold text-white">{plan.price || "-"}</p>
        </div>

        <ul className="mt-4 space-y-3 text-gray-300 flex-grow">
            {(plan.features || []).map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <Link
            href={href}
            target="_blank"
            className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
            Pilih Paket
            <FaArrowRight />
        </Link>
    </div>
);

export default function PaketLayanan() {
    const [category, setCategory] = useState("website");
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/profile", { cache: "no-store" });
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Gagal fetch portfolio:", err);
            }
        }
        fetchProfile();
    }, []);


    async function loadProductsFor(cat) {
        try {
            setLoading(true);
            const type = TYPE_MAP[cat];
            const res = await fetch(`/api/products?type=${encodeURIComponent(type)}`, { cache: "no-store" });
            const data = await res.json();
            // data: [{ id, title, description, price, features[], type, is_active, is_popular? }]
            const mapped = Array.isArray(data) ? data.filter(p => p.is_active !== false) : [];
            setPlans(mapped);
        } catch (e) {
            console.error(e);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProductsFor(category);
    }, [category]);

    // tentukan kartu “populer”
    const popularIndex = useMemo(() => {
        const idxFromDB = plans.findIndex(p => p.is_popular === true); // kalau ada kolom ini
        return idxFromDB >= 0 ? idxFromDB : 0; // fallback: item pertama
    }, [plans]);

    return (
        <section className="py-16" id="price">
            <div className="container mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mx-auto max-w-xl text-center"
                >
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        Harga Terbaik
                    </span>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                        Paket Layanan <span className="text-blue-600">Fleksibel</span> untuk{" "}
                        <span className="text-blue-600">Semua Kebutuhan</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Pilih paket yang paling sesuai dengan target dan anggaran Anda. Kami siap membantu Anda bertumbuh.
                    </p>
                </motion.div>

                {/* Kategori */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                >
                    <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <CategoryButton
                            label="Website"
                            icon={<FaStore />}
                            active={category === "website"}
                            onClick={() => setCategory("website")}
                        />
                        <CategoryButton
                            label="Sosial Media"
                            icon={<FaBuilding />}
                            active={category === "sosmed"}
                            onClick={() => setCategory("sosmed")}
                        />
                    </div>

                    {/* Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
                        className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                    >
                        {loading ? (
                            <div className="col-span-full text-center text-gray-400">Loading...</div>
                        ) : plans.length === 0 ? (
                            <div className="col-span-full text-center text-gray-400">Belum ada produk pada kategori ini.</div>
                        ) : (
                            plans.map((p, i) => (
                                <PricingCard
                                    key={p.id || i}
                                    plan={{
                                        title: p.title,
                                        description: p.description,
                                        price: p.price,
                                        features: Array.isArray(p.features) ? p.features : [],
                                    }}
                                    highlight={i === popularIndex}
                                    href={`https://wa.me/${profile.whatsapp}`}
                                />
                            ))
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}