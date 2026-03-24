import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import WhatsAppFab from "@/components/layout/WhatsAppFab";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bandaru Agrotech Private Limited | Premium Rice Millers",
  description:
    "Over two decades of heritage in Miryalaguda, delivering the finest premium quality rice to households and businesses across India.",
  icons: {
    icon: [
      { url: "/assets/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/assets/favicon_io/favicon.ico",
    apple: "/assets/favicon_io/apple-touch-icon.png",
  },
  manifest: "/assets/favicon_io/site.webmanifest",
  openGraph: {
    title: "Bandaru Agrotech | Premium Rice Millers",
    description: "State-of-the-art rice milling delivering excellence in every grain.",
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
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${poppins.variable} scroll-smooth`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[family-name:var(--font-poppins)] text-gray-800 bg-white antialiased selection:bg-brand selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <main>{children}</main>
            <Footer />
            <WhatsAppFab />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
