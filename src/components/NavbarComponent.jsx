"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { HiMenuAlt4 } from "react-icons/hi";
import { Link as LinkScroll } from "react-scroll";
import Logo from './../../public/assets/Logo.png'
import Link from 'next/link';
import Image from "next/image";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    };

    const navLinks = [
        { to: "home", text: "Home" },
        { to: "about", text: "About" },
        { to: "price", text: "Price" },
        { to: "portfolio", text: "Portfolio" },
        { to: "alurkerja", text: "Alur Kerja" },
        { to: "faq", text: "FAQ" },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null, // Menggunakan viewport sebagai root
            rootMargin: "-80px 0px -50% 0px", // (top, right, bottom, left) - Menyesuaikan offset navbar dan memicu saat section berada di bagian atas layar
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        const sections = navLinks.map(link => document.getElementById(link.to));
        sections.forEach(section => {
            if (section) observer.observe(section);
        });

        // Cleanup observer saat komponen di-unmount
        return () => {
            sections.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, [navLinks]);

    const scrollProps = {
        smooth: true,
        spy: true,
        offset: -80,
    };

    return (
        <>
            <header className={`fixed inset-x-0 top-0 z-50 h-20 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-800' : 'bg-transparent'}`}>
                <nav className="container mx-auto flex h-full items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    
                    <Link href="/" className="text-3xl font-bold text-white select-none flex gap-2 items-center">
                        {profile.logo_url && <Image src={profile.logo_url} width={36} height={36} alt={`${profile.title} Logo`} className="rounded-xl shadow" />}
                        {profile.title}
                    </Link>

                    {/* Navigasi Desktop */}
                    <div className="hidden items-center gap-x-6 md:flex">
                        {navLinks.map((link) => (
                            <LinkScroll
                                key={link.text}
                                to={link.to}
                                {...scrollProps}
                                activeClass="text-blue-400 active"
                                className={`peer cursor-pointer text-lg font-medium transition-colors hover:text-blue-400 ${activeSection === link.to ? 'text-blue-400' : 'text-neutral-300'}`}>
                                {link.text}
                            </LinkScroll>
                        ))}
                    </div>

                    {/* Tombol Aksi Desktop */}
                    <div className="hidden items-center gap-x-3 md:flex">
                        <Link
                            href={`https://wa.me/${profile.whatsapp}`}
                            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:text-neutral-100 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                            <FaWhatsapp className="size-5 mr-2" />
                            Konsultasi Gratis
                        </Link>
                        <Link href={`https://www.instagram.com/${profile.instagram}`} target="_blank" className="inline-flex items-center justify-center rounded-md bg-white size-10 text-gray-900 hover:text-neutral-100 shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                            <FaInstagram className="size-5" />
                        </Link>
                        <Link href={`https://www.facebook.com/${profile.facebook}`} target="_blank" className="inline-flex items-center justify-center rounded-md bg-white size-10 text-gray-900 hover:text-neutral-100 shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                            <FaFacebook className="size-5" />
                        </Link>
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="md:hidden">
                        <motion.button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-md p-2 text-white hover:bg-gray-700 focus:outline-none"
                            whileTap={{ scale: 0.95 }}>
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}>
                                {isMenuOpen ? <FiX className="size-6" /> : <HiMenuAlt4 className="size-6" />}
                            </motion.div>
                        </motion.button>
                    </div>
                </nav>
            </header>

            {/* Menu Mobile */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-20 z-40 border-b-2 border-gray-800 bg-gray-900/80 p-6 shadow-lg md:hidden">
                        <div className="flex flex-col gap-y-5">
                            {navLinks.map((link) => (
                                <LinkScroll
                                    key={link.text}
                                    to={link.to}
                                    {...scrollProps}
                                    activeClass="text-blue-400"
                                    className={`cursor-pointer text-lg font-semibold transition-colors hover:text-blue-400 ${activeSection === link.to ? 'text-blue-400' : 'text-neutral-200'}`}
                                    onClick={() => setIsMenuOpen(false)}>
                                    {link.text}
                                </LinkScroll>
                            ))}
                            <Link href={`https://wa.me/${profile.whatsapp}`}
                                className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-green-600 hover:text-neutrall-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full"
                                onClick={() => setIsMenuOpen(false)}>
                                <FaWhatsapp className="size-5 mr-2" />
                                Konsultasi Gratis
                            </Link>

                            <div className="mt-4 flex justify-center gap-x-4 border-t border-gray-700 pt-6">
                                <Link href={`https://www.instagram.com/${profile.instagram}`} target="_blank" className="inline-flex items-center justify-center rounded-md bg-white size-10 text-gray-900 shadow-sm transition-colors hover:bg-red-600 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                    <FaInstagram className="size-6" />
                                </Link>
                                <Link href={`https://www.facebook.com/${profile.facebook}`} target="_blank" className="inline-flex items-center justify-center rounded-md bg-white size-10 text-gray-900 shadow-sm transition-colors hover:bg-blue-600 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                    <FaFacebook className="size-6" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
