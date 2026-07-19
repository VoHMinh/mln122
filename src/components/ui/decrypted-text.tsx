"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const CHARS = "0101010101XX$$&&##%%@@**";

export default function DecryptedText({
  text,
  speed = 40, // ms per character update
  delay = 0.2, // delay in seconds before decryption starts
  className,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const totalLength = text.length;

    // Start with fully randomized text
    const initialText = Array.from({ length: totalLength }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    setDisplayText(initialText);

    const startDecryption = () => {
      intervalRef.current = setInterval(() => {
        if (currentIndex >= totalLength) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayText(text); // Ensure it's exact at the end
          return;
        }

        setDisplayText((prev) => {
          const charArray = prev.split("");
          // Reveal current index
          charArray[currentIndex] = text[currentIndex];
          
          // Randomize remaining indices
          for (let i = currentIndex + 1; i < totalLength; i++) {
            if (text[i] === " ") {
              charArray[i] = " ";
            } else {
              charArray[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
          }
          
          return charArray.join("");
        });

        // Speed up space characters
        if (text[currentIndex] === " ") {
          currentIndex += 1;
        }
        
        currentIndex += 1;
      }, speed);
    };

    const delayTimeout = setTimeout(startDecryption, delay * 1000);

    return () => {
      clearTimeout(delayTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, delay, isInView]);

  return (
    <span ref={containerRef} className={className}>
      {displayText || text}
    </span>
  );
}
