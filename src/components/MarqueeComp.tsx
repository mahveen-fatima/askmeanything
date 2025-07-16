"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

const reviews = [

    { 
        name: "Jack",  
        username: "@jack", 
        content: "How do you approach learning new technologies without getting overwhelmed?", 
        img: "https://avatar.vercel.sh/jack", 
        received: "10 minutes ago" 
    },
    { 
        name: "Jill",  
        username: "@jill",  
        content: "What's one common misconception about software development you wish more people understood?", 
        img: "https://avatar.vercel.sh/jill", 
        received: "2 hours ago" 
    },
    { 
        name: "John",  
        username: "@john",  
        content: "Beyond coding, what’s a non-technical skill you've found surprisingly valuable in your developer journey?", 
        img: "https://avatar.vercel.sh/john", 
        received: "1 day ago" 
    },
    { 
        name: "Jane",  
        username: "@jane",  
        content: "Beyond coding, what's one skill that unexpectedly boosted your journey as a developer?", 
        img: "https://avatar.vercel.sh/jane", 
        received: "10 minutes ago" 
    },
    { 
        name: "Jenny", 
        username: "@jenny", 
        content: "When facing a really tough technical problem, what's your go-to strategy for staying motivated and finding a solution?", 
        img: "https://avatar.vercel.sh/jenny", 
        received: "2 hours ago" 
    },
    { 
        name: "James", 
        username: "@james", 
        content: "If you could fast-forward five years, what's one new technology or trend you're most excited to see mature and impact development?", 
        img: "https://avatar.vercel.sh/james", 
        received: "1 day ago" 
    },
]

const ReviewCard = ({
  img, 
  name,
  username,
  content,
  received
}: {
  img: string
  name: string
  username: string
  content: string
  received: string
}) => (
  <figure
    className={cn(
      "relative h-48 w-72 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2 flex-shrink-0",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] flex flex-col",
    )}
  >
    <div className="flex items-center gap-2">
      <Image
        className="rounded-full"
        width="32"
        height="32"
        alt=""
        src={img || "/placeholder.svg"}
      />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white line-through">
          {name}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40 line-through">
          {username}
        </p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{content}</blockquote>
    <figcaption className="text-xs font-medium dark:text-white/40 mt-auto">
        {received}
    </figcaption>
  </figure>
)

export function MarqueeDemo() {
  const stripRef = useRef<HTMLDivElement>(null)
  const [loopWidth, setLoopWidth] = useState(0)

  useEffect(() => {
    if (stripRef.current) {
      // total scrollable width = two copies
      const totalW = stripRef.current.scrollWidth
      // one copy width = half the total
      setLoopWidth(totalW / 2)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1 * var(--loop-width))); }
        }
        .marquee-container {
          --loop-width: 0px;
          animation: scroll 30s linear infinite;
        }
        .marquee-wrapper:hover .marquee-container {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative flex w-full overflow-hidden py-4">
        <div className="marquee-wrapper overflow-hidden">
          <div
            ref={stripRef}
            className="marquee-container flex"
            style={
              {
                "--loop-width": `${loopWidth}px`,
              } as React.CSSProperties
            }
          >
            {reviews.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
            {reviews.map((r, i) => (
              <ReviewCard key={reviews.length + i} {...r} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-stone-100 to-transparent dark:from-gray-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-stone-100 to-transparent dark:from-gray-900" />
      </div>
    </>
  )
}
