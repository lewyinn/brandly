"use client";

import { motion } from 'framer-motion';
import React from 'react';
import { 
    PiPresentationChartLight, 
    PiChatsLight, 
    PiFileTextLight, 
    PiPencilLineLight, 
    PiPaperPlaneTiltLight, 
    PiCreditCardLight,
    PiStarLight
} from 'react-icons/pi';

// Data untuk setiap langkah dalam alur kerja
const workflowSteps = [
    {
        icon: <PiPresentationChartLight />,
        title: 'Penawaran & Pendekatan Awal',
        description: 'Kami menyusun proposal penawaran yang jelas dan melakukan presentasi untuk mengenalkan layanan kami kepada calon klien (UMKM, Sekolah, Perusahaan).',
        color: 'text-cyan-400',
    },
    {
        icon: <PiChatsLight />,
        title: 'Diskusi Kebutuhan Klien',
        description: 'Kami berdiskusi secara mendalam untuk memahami kebutuhan spesifik, ruang lingkup pekerjaan, serta menentukan target dan deadline proyek.',
        color: 'text-green-400',
    },
    {
        icon: <PiFileTextLight />,
        title: 'Penandatanganan MoU',
        description: 'Kesepakatan kerja dituangkan dalam MoU sederhana untuk menjamin kejelasan ruang lingkup, sistem pembayaran, dan hak & kewajiban kedua belah pihak.',
        color: 'text-yellow-400',
    },
    {
        icon: <PiPencilLineLight />,
        title: 'Proses Pengerjaan & Revisi',
        description: 'Tim kami mulai mengerjakan proyek (desain atau website), mengirimkan preview secara berkala, dan menerima masukan untuk proses revisi.',
        color: 'text-purple-400',
    },
    {
        icon: <PiPaperPlaneTiltLight />,
        title: 'Finalisasi & Pengiriman Hasil',
        description: 'Setelah semua revisi disetujui, kami mengirimkan hasil akhir dalam format siap pakai dan memastikan klien menerima hasil sesuai ekspektasi.',
        color: 'text-pink-400',
    },
    {
        icon: <PiCreditCardLight />,
        title: 'Pembayaran & Invoice',
        description: 'Kami mengirimkan invoice resmi untuk proses pelunasan pembayaran sesuai dengan kesepakatan di awal (misalnya, setelah DP dibayarkan).',
        color: 'text-orange-400',
    },
    {
        icon: <PiStarLight />,
        title: 'Testimoni & Follow Up',
        description: 'Untuk membangun hubungan jangka panjang, kami meminta testimoni dan menjaga komunikasi untuk peluang kerja sama di masa depan.',
        color: 'text-indigo-400',
    },
];

const WorkflowCard = ({ step, index }) => {
    const isEven = index % 2 === 0;
    return (
        <div className="flex md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 md:w-12">
                <div className="w-0.5 h-full bg-gray-700 group-first:h-1/2 group-first:self-end group-last:h-1/2 group-last:self-start"></div>
            </div>
            <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 border-2 border-gray-700 text-2xl ${step.color}`}>
                {step.icon}
            </div>
            <div className="w-full md:w-5/12 p-4 rounded-lg">
                <h3 className={`text-lg font-bold ${isEven ? 'md:text-right' : 'md:text-left'} text-white`}>{step.title}</h3>
                <p className={`text-gray-400 ${isEven ? 'md:text-right' : 'md:text-left'}`}>{step.description}</p>
            </div>
        </div>
    );
};


export default function WorkFlow() {
    return (
        <section className='py-16' id="alurkerja">
            <div className="mx-auto container">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mx-auto max-w-xl text-center">
                    <span className="bg-blue-500/10 text-blue-400 text-sm font-medium px-3 py-1.5 rounded-full">
                        Proses Kami
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Alur Kerja Profesional & Terstruktur
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Setiap proyek kami jalankan melalui tahapan yang jelas untuk memastikan hasil terbaik dan kepuasan klien.
                    </p>
                </motion.div>

                {/* Timeline */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                    className="mt-16 flex flex-col bg-blue-400/10 p-3 py-5 rounded-2xl">
                    {workflowSteps.map((step, index) => (
                        <WorkflowCard key={index} step={step} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
