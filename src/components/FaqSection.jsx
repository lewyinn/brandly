"use client";

import React, { useState } from 'react';
import { PiPlusBold, PiMinusBold } from 'react-icons/pi';
import { FaLaptopCode, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const faqData = {
    website: [
        {
            question: 'Berapa lama proses pembuatan website?',
            answer: 'Waktu pengerjaan website statis rata-rata 3–7 hari kerja, tergantung pada jumlah halaman dan tingkat kerumitan desain yang Anda inginkan.',
        },
        {
            question: 'Apakah websitenya bisa di-update sendiri?',
            answer: 'Saat ini kami membuat website statis (tanpa backend), sehingga konten tidak bisa di-update langsung oleh pengguna. Namun, kami siap membantu revisi isi jika dibutuhkan di kemudian hari.',
        },
        {
            question: 'Apakah saya perlu beli domain dan hosting sendiri?',
            answer: 'Tidak perlu. Kami bisa membantu proses pengadaan domain dan hosting yang sesuai dengan budget Anda. Namun, jika Anda sudah memilikinya, kami juga bisa menggunakan milik Anda.',
        },
    ],
    instagram: [
        {
            question: 'Apa saja yang termasuk dalam paket manajemen Instagram?',
            answer: 'Paket bulanan kami umumnya mencakup desain feed (12–30 post), desain story harian, penulisan caption & riset hashtag, serta penjadwalan posting (opsional auto-post).',
        },
        {
            question: 'Apakah saya harus memberikan bahan konten?',
            answer: 'Bisa iya, bisa tidak. Jika Anda memiliki bahan seperti logo, foto produk, atau visi-misi, kami akan menggunakannya. Jika belum, kami bisa bantu buatkan dengan biaya tambahan di luar paket utama.',
        },
        {
            question: 'Bagaimana jika saya ingin revisi desain?',
            answer: 'Anda mendapatkan hak revisi minor sebanyak 2 kali per bulan secara gratis. Untuk revisi yang lebih besar atau tambahan, akan dikenakan biaya yang terjangkau.',
        },
        {
            question: 'Apakah engagement (like, komen, followers) dijamin naik?',
            answer: 'Fokus utama kami adalah pada kualitas konten branding dan visual yang menarik. Kami juga akan memberi saran strategi organik untuk meningkatkan engagement, namun hasil akhirnya dapat bervariasi.',
        },
        {
            question: 'Bagaimana sistem pembayarannya?',
            answer: 'Untuk jasa manajemen Instagram, pembayaran dilakukan per bulan di awal (sistem langganan). Anda bebas untuk tidak memperpanjang layanan setelah masa aktif berakhir.',
        },
    ],
};

const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-blue-500/10 px-4 py-1.5 rounded-2xl border-b border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-5 text-left">
                <span className="text-base font-semibold text-white pr-4">{question}</span>
                <div className="flex-shrink-0">
                    <PiPlusBold 
                        className={`text-xl text-blue-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} 
                    />
                </div>
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-400 pr-8">{answer}</p>
                </div>
            </div>
        </div>
    );
};

// Komponen utama FAQ
export default function FAQ() {
    return (
        <section className="py-16" id="faq">
            <div className="mx-auto container">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mx-auto max-w-xl text-center">
                    <span className="bg-blue-500/10 text-blue-400 text-sm font-medium px-3 py-1.5 rounded-full">
                        Butuh Bantuan?
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Tidak menemukan jawaban yang Anda cari? Jangan ragu untuk menghubungi kami secara langsung.
                    </p>
                </motion.div>

                {/* Grid untuk kategori FAQ */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
                    {/* Kolom Pembuatan Website */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex items-center gap-4">
                            <FaLaptopCode className="h-8 w-8 text-blue-400" />
                            <h3 className="text-2xl font-bold text-white">Pembuatan Website</h3>
                        </div>
                        <div className="space-y-2">
                            {faqData.website.map((item, index) => (
                                <AccordionItem key={index} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Kolom Manajemen Instagram */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex items-center gap-4">
                            <FaInstagram className="h-8 w-8 text-blue-400" />
                            <h3 className="text-2xl font-bold text-white">Manajemen Instagram</h3>
                        </div>
                        <div className="space-y-2">
                            {faqData.instagram.map((item, index) => (
                                <AccordionItem key={index} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
