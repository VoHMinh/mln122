"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const handleResize = () => {
      setSvgHeight(contentRef.current?.offsetHeight || 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(contentRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 15,
  });

  return (
    <motion.div ref={ref} className={cn("relative w-full h-full", className)}>
      {/* Absolute tracing line positioned on the left margin, invisible on small mobile */}
      <div className="absolute left-6 md:left-12 top-6 z-40 hidden sm:block">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          className="ml-[9px] h-3.5 w-3.5 rounded-full border border-copper-trace/40 align-middle justify-center flex items-center shadow-[0_0_8px_rgba(212,145,90,0.5)] bg-deep-circuit"
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-copper-trace"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 10 0V ${svgHeight}`}
            fill="none"
            stroke="var(--muted-steel)"
            strokeOpacity="0.12"
            strokeWidth="1.5"
          ></motion.path>
          <motion.path
            d={`M 10 0V ${svgHeight}`}
            fill="none"
            stroke="url(#beam-gradient)"
            strokeWidth="2"
            style={{
              pathLength: pathLength,
            }}
            className="motion-reduce:hidden"
          ></motion.path>
          <defs>
            <linearGradient
              id="beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2={svgHeight}
            >
              <stop stopColor="var(--signal-cyan)" stopOpacity="0" />
              <stop stopColor="var(--signal-cyan)" />
              <stop stopColor="var(--copper-trace)" />
              <stop stopColor="var(--disruption-amber)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Content wrapper with left padding on larger screens to make space for the line */}
      <div ref={contentRef} className="w-full sm:pl-16 md:pl-24">
        {children}
      </div>
    </motion.div>
  );
};
