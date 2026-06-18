import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Nav } from "./nav"
import { AuthGuard } from "@/components/AuthGuard"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import { Onboarding } from "@/components/Onboarding"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DevEstudos — Sua Jornada JavaScript",
  description: "Plataforma de estudos gamificada para desenvolvedores",
  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed] scrollbar-thin">
        <AuthGuard>
          <Nav />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </AuthGuard>
        <Onboarding />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
