"use client";
import React, { useRef, useState } from "react";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: React.ReactNode;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the entire section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Determine active card based on scroll progress (0 to 1)
    const closestIndex = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );
    if (closestIndex >= 0 && closestIndex < cardLength) {
      setActiveCard(closestIndex);
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col md:flex-row justify-between w-full max-w-7xl mx-auto gap-8 md:gap-16 px-4"
      style={{ height: `${cardLength * 100}vh` }}
    >
      {/* Left side scrolling text */}
      <div className="w-full md:w-1/2 flex flex-col justify-start">
        {content.map((item, index) => (
          <div
            key={index}
            className="min-h-screen flex flex-col justify-center py-12"
          >
            <motion.h3
              initial={{ opacity: 0.3, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20% 0px -40% 0px" }}
              transition={{ duration: 0.5 }}
              className={cn(
                "font-display text-2xl md:text-3xl font-bold mb-6 border-l-4 pl-4 transition-colors duration-300",
                activeCard === index ? "border-signal-cyan text-pulse-text animate-pulse-glow" : "border-muted-steel/20 text-muted-steel"
              )}
            >
              {item.title}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0.3, y: 20 }}
              whileInView={{ opacity: 0.9, y: 0 }}
              viewport={{ once: false, margin: "-20% 0px -40% 0px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-body text-sm md:text-base text-muted-steel leading-relaxed"
            >
              {item.description}
            </motion.div>
            
            {/* Inline visual content fallback on mobile, hidden on desktop */}
            {item.content && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block md:hidden mt-8 w-full aspect-square bg-circuit-surface/40 border border-muted-steel/15 rounded-3xl p-6 shadow-xl overflow-hidden backdrop-blur-sm"
              >
                {item.content}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Right side sticky card element (desktop only) */}
      <div className="hidden md:flex md:w-1/2 h-screen sticky top-0 items-center justify-center">
        <motion.div
          key={activeCard}
          initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotate: 1 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "w-full max-w-lg aspect-square bg-circuit-surface/80 border border-muted-steel/20 rounded-3xl p-8 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-md",
            contentClassName
          )}
        >
          {content[activeCard]?.content ?? null}
        </motion.div>
      </div>
    </div>
  );
};
