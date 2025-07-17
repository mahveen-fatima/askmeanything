"use client"

import { MarqueeDemo } from "@/components/MarqueeComp"

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-24 lg:px-32 py-16">
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Dive into the world of<br/>anonymous conversations.
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl">
            Explore AMA—where your identity remains a secret.
          </p>
        </section>

        <MarqueeDemo />
      </main>

      <footer className="text-center py-4 sm:py-6 bg-gray-50">
        <span className="text-sm sm:text-base text-gray-500">
          © 2025 AMA. All rights reserved.
        </span>
      </footer>
    </>
  )
}

export default Home

