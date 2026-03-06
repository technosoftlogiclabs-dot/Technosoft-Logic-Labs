import type { Metadata } from "next";
import "./globals.css";
import SpotlightBackground from "@/components/SpotlightBackground";

export const metadata: Metadata = {
  title: "Technosoft Logic Labs",
  description: "Technosoft Logic Labs construiește sisteme software fiabile pentru companii moderne."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <SpotlightBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}