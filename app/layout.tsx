import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./assets/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "REST API Next 14",
    description: "Generated by create next app & Pouria Darandi",
};

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}

export default RootLayout;
