import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { LayoutProvider } from "./LayoutProvider";
import '@/styles/app.scss'

const poppins = Poppins({ subsets: ['latin'], weight: ['100', '300', '400', '700', '900'] })

export const metadata: Metadata = {
  title: "Vending machine",
  description: "Buy and sell products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <LayoutProvider>
        {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
