import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['400', '600'], // Specify weights you use
});

export const metadata = {
  title: {
    default: "Brandly | Jasa Desain dan Website UMKM & Sekolah",
    template: "%s | Brandly Digital Creative",
  },
  description: "Brandly adalah layanan digital kreatif yang menyediakan jasa desain Instagram dan pembuatan website untuk UMKM, sekolah, dan perusahaan. Tingkatkan branding digital Anda bersama kami.",
  keywords: [
    "jasa desain instagram",
    "jasa pembuatan website",
    "jasa website UMKM",
    "jasa desain kreatif",
    "jasa branding digital",
    "website company profile",
    "website sekolah",
    "Brandly Digital Creative"
  ],
  metadataBase: new URL("https://brandlydigital.vercel.app"), // ganti dengan domain kamu
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Brandly | Jasa Desain dan Website UMKM & Sekolah",
    description: "Jasa desain feed Instagram dan pembuatan website statis untuk UMKM, sekolah, dan perusahaan.",
    url: "https://brandlydigital.vercel.app",
    siteName: "Brandly Digital Creative",
    images: [
      {
        url: "https://brandlydigital.vercel.app/assets/logo.png", // upload image OG kamu
        width: 1200,
        height: 630,
        alt: "Brandly Digital Creative",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandly | Jasa Desain dan Website UMKM & Sekolah",
    description: "Jasa desain Instagram dan pembuatan website statis. Solusi branding digital untuk bisnis lokal.",
    images: ["https://brandlydigital.vercel.app/assets/logo.png"],
    creator: "@brandlyid", // opsional
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/Logo.png" />
        <link rel="apple-touch-icon" href="/assets/Logo.png" />
      </head>
      <body className={`${fredoka.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}