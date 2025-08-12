"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import imgDigital from './../../public/assets/DigitalImage.jpg'
import { FaBullhorn, FaCheck, FaCode, FaHandshake } from 'react-icons/fa'
import Image from 'next/image'

const About = () => {
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

    return (
        <>
            <div className='py-20' id='about'>
                <div className='flex flex-col lg:flex-row gap-16 justify-between items-center mx-auto'>

                    {/* Left Column (Image) - Animates when in view */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }} // Ensures animation runs every time it's in view
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="relative w-auto lg:w-3xl h-auto"
                    >
                        {/* Gambar */}
                        <Image src={imgDigital} loading='lazy'
                            alt={`${profile.subtitle} - About Us`}
                            className="w-full h-auto lg:h-[480px] rounded-2xl object-cover" />

                        {/* Overlay dengan teks */}
                        <div className="absolute -bottom-8 right-0 bg-white p-3 rounded-xl flex items-center shadow-md">
                            <div className="w-8 lg:w-12 h-8 lg:h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-lg lg:text-xl font-bold mr-2">
                                <FaCheck />
                            </div>
                            <div>
                                <p className="text-lg lg:text-2xl font-bold text-gray-800">Brandly</p>
                                <p className="text-sm lg:text-base text-gray-700">Inovasi Digital Untuk bisnis anda.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column (Text) - Animates when in view */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }} // Ensures animation runs every time it's in view
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className='flex flex-col justify-center items-start w-auto lg:w-3xl'
                    >
                        {/* Label */}
                        <span className=" text-blue-600 text-xs lg:text-base font-medium">
                            Tentang Kami
                        </span>

                        {/* Judul */}
                        <h2 className="text-5xl font-bold mt-4">
                            Partner Digital Anda untuk <span className="text-blue-600">Tumbuh Bersama</span>
                        </h2>

                        {/* Deskripsi */}
                        <p className="text-gray-400 text-base lg:text-lg mt-4">
                            <span className='font-bold'>{profile.title}</span> lahir dari keyakinan bahwa setiap bisnis, berapapun skalanya, berhak memiliki citra digital yang kuat dan profesional.
                            Kami bukan sekadar penyedia jasa, tapi <span className='font-bold'>partner strategis</span> Anda dalam menavigasi dunia digital. Tim kami berdedikasi untuk memahami
                            visi Anda dan mengubahnya menjadi hasil nyata yang meningkatkan visibilitas dan kredibilitas brand Anda.
                        </p>

                        {/* Kelebihan */}
                        <div className='flex flex-col justify-center items-start gap-4 mt-4'>
                            <div className='flex justify-center items-center gap-4'>
                                <span className='px-2 py-2 bg-blue-800 rounded-lg'>
                                    <FaBullhorn className='text-2xl text-white' />
                                </span>
                                <div>
                                    <h3 className='text-lg font-semibold text-white'>
                                        Promosi Tepat Sasaran
                                    </h3>
                                    <p className='text-sm text-gray-400 mt-1'>
                                        Strategi media sosial yang dirancang khusus untuk menjangkau audiens ideal Anda dan meningkatkan engagement.
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-center items-center gap-4'>
                                <span className='px-2 py-2 bg-blue-800 rounded-lg'>
                                    <FaCode className='text-2xl text-white' />
                                </span>
                                <div>
                                    <h3 className='text-lg font-semibold text-white'>
                                        Website Modern & Fungsional
                                    </h3>
                                    <p className='text-sm text-gray-400 mt-1'>
                                        Membangun website yang tidak hanya indah secara visual, tetapi juga cepat, responsif, dan mudah dikelola.
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-center items-center gap-4'>
                                <span className='px-2 py-2 bg-blue-800 rounded-lg'>
                                    <FaHandshake className='text-2xl text-white' />
                                </span>
                                <div>
                                    <h3 className='text-lg font-semibold text-white'>
                                        Kolaborasi & Kemitraan
                                    </h3>
                                    <p className='text-sm text-gray-400 mt-1'>
                                        Kami percaya pada komunikasi yang transparan untuk memastikan setiap proyek sesuai dengan ekspektasi Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default About