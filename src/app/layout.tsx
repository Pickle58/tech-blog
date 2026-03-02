import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/general/navbar/Navbar";
import Footer from "./components/general/Footer";
import SignInModal from "./components/modals/SignInModal";
import SearchModal from "./components/modals/SearchModal";

const poppins =Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TechBlog",
  description: "TechBlog Pilkington",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-background`}
      >
        <Navbar />
        {children}
        <Footer />
        <SignInModal />
        <SearchModal />
      </body>
    </html>
  );
}
