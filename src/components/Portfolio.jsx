"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLink, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

const FilterButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
        {label}
    </button>
);

const PortfolioCard = ({ project }) => (
    <div className="group flex flex-col h-full bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:border-blue-500 transition-all duration-300">
        <div className="relative w-full aspect-video overflow-hidden">
            <Image
                src={project.image || 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found'}
                alt={`Gambar proyek ${project.title}`}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                    // fallback aman untuk Next/Image
                    try { e.currentTarget.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found'; } catch { }
                }}
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <span className="inline-block text-xs font-semibold text-blue-400 uppercase mb-2">
                {project.category}
            </span>
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag, idx) => (
                    <span key={idx} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            <Link
                href={project.url || '#'}
                target="_blank"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
                Lihat Proyek <FaLink />
            </Link>
        </div>
    </div>
);

export default function Portfolio() {
    const [filter, setFilter] = useState('Semua');
    const [showAll, setShowAll] = useState(false);
    const [items, setItems] = useState([]);        // raw dari API (sudah di-map)
    const [loading, setLoading] = useState(true);

    // Load dari API (public)
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                // ambil hanya yang aktif (kalau kamu pakai policy is_active)
                const res = await fetch('/api/portfolios?active=true', { cache: 'no-store' });
                const data = await res.json();

                // map ke shape UI
                const mapped = Array.isArray(data) ? data.map(p => ({
                    title: p.judul || '',
                    category: p.type || '',
                    description: p.deskripsi || '',
                    image: p.foto_url || '',
                    tags: Array.isArray(p.tech) ? p.tech : [],
                    url: p.link_portfolio || '#',
                    created_at: p.created_at,
                })) : [];

                if (alive) setItems(mapped);
            } catch (e) {
                if (alive) setItems([]);
                console.error('Gagal load portfolios:', e);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(items.map(p => p.category).filter(Boolean)));
        return ['Semua', ...unique];
    }, [items]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setShowAll(false);
    };

    const allFilteredProjects = useMemo(() => {
        if (filter === 'Semua') return items;
        return items.filter(p => p.category === filter);
    }, [items, filter]);

    const visibleProjects = showAll ? allFilteredProjects : allFilteredProjects.slice(0, 3);

    return (
        <section className='py-16' id="portfolio">
            <div className="container mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mx-auto max-w-xl text-center">
                    <span className="bg-blue-500/10 text-blue-400 text-sm font-medium px-3 py-1.5 rounded-full">
                        Portofolio Kami
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                        Karya yang Kami Banggakan
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Lihat bagaimana kami membantu klien mencapai tujuan mereka melalui desain yang fungsional dan promosi yang efektif.
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                    className="mt-12 flex justify-center flex-wrap gap-3">
                    {categories.map(category => (
                        <FilterButton
                            key={category}
                            label={category}
                            active={filter === category}
                            onClick={() => handleFilterChange(category)}
                        />
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-xl border border-gray-700 bg-gray-800/50 animate-pulse" />
                        ))
                    ) : visibleProjects.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400">Belum ada portfolio.</div>
                    ) : (
                        visibleProjects.map((project, index) => (
                            <PortfolioCard key={index} project={project} />
                        ))
                    )}
                </motion.div>

                {/* Tombol Lihat Lebih Banyak / Sedikit */}
                {!loading && allFilteredProjects.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
                        className="mt-12 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Lebih Banyak'}
                            {showAll ? <FaArrowUp /> : <FaArrowDown />}
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
