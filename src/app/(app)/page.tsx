"use client"
import {MarqueeDemo} from "@/components/MarqueeComp"

const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-6xl font-bold">Dive into the world of <br/> anonymous conversations.</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore ama - where your identity remains a secret
        </p>
      </section>
      <MarqueeDemo />
    </main>
    <footer className="text-center p-4 md:p-6">
      2025 AMA. All rights reserved.
    </footer>
    </>
  )
}

export default Home
