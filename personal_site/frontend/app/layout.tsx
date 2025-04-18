import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ParticleBackground from "@/components/animations/particle-background"
import { GsapProvider } from "@/components/providers/gsap-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portfolio | Your Name",
  description: "Personal portfolio website showcasing my skills and projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preload Google Fonts for the font-changing effect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Ubuntu:wght@400;700&family=Rubik:wght@400;700&family=Oswald:wght@400;700&family=Fira+Sans:wght@400;700&family=Nunito:wght@400;700&family=Poppins:wght@400;700&family=Quicksand:wght@400;700&family=Comfortaa:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&family=Permanent+Marker&family=Architects+Daughter&family=Shadows+Into+Light&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GsapProvider>
            <ParticleBackground />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </GsapProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
