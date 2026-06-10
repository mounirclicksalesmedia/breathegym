import type { Metadata } from "next";
import { Poppins, Almarai, Anton } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://breathe-ladies.sa"),
  title: "Breathe Ladies Fitness — نادي بريث للسيدات | Riyadh",
  description:
    "Breathe Ladies Fitness — an elegant women-only gym & wellness club in Al Malqa, Riyadh. Premium training, spa and a free trial session. نادي بريث الرياضي للسيدات في الملقا، الرياض.",
  keywords: [
    "ladies gym Riyadh",
    "women gym Saudi Arabia",
    "Breathe Ladies Fitness",
    "نادي نسائي الرياض",
    "جيم نسائي",
    "Al Malqa gym",
  ],
  openGraph: {
    title: "Breathe Ladies Fitness — نادي بريث للسيدات",
    description:
      "An elegant women-only gym & wellness club in Al Malqa, Riyadh. Book your free trial session.",
    images: ["/images/hero.webp"],
    locale: "en_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${poppins.variable} ${almarai.variable} ${anton.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
