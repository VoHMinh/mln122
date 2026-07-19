"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Gamepad2, Trophy, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const FlowingMenu = dynamic(() => import("@/components/ui/FlowingMenu"), { ssr: false });

const NAV_ITEMS = [
  { href: "/", label: "Câu chuyện", icon: <BookOpen size={15} /> },
  { href: "/game", label: "Trò chơi", icon: <Gamepad2 size={15} /> },
  { href: "/leaderboard", label: "Xếp hạng", icon: <Trophy size={15} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  // FlowingMenu items for mobile
  const flowingMenuItems = NAV_ITEMS.map((item) => ({
    link: item.href,
    text: item.label,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%2303b3c3' width='600' height='400' rx='8'/%3E%3C/svg%3E",
  }));

  return (
    <>
      {/* ===== Desktop + Mobile Top Bar ===== */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 ease-out",
          scrolled
            ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none"
          >
            {/* Glowing dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal-cyan" />
            </span>
            <span className="font-display font-extrabold text-base md:text-lg tracking-tight text-white group-hover:text-signal-cyan transition-colors duration-300">
              VIETNAM
              <span className="text-signal-cyan ml-0.5">4.0</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-cyan",
                    isActive
                      ? "text-signal-cyan"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-signal-cyan/10 border border-signal-cyan/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobile}
            className="md:hidden relative z-[60] flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:border-signal-cyan/40 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ===== Mobile Fullscreen FlowingMenu Overlay ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[55] md:hidden"
            onClick={toggleMobile}
          >
            <div className="h-full pt-16" onClick={(e) => e.stopPropagation()}>
              <FlowingMenu
                items={flowingMenuItems}
                speed={12}
                textColor="#ffffff"
                bgColor="#0a0e14"
                marqueeBgColor="#03b3c3"
                marqueeTextColor="#0a0e14"
                borderColor="rgba(255,255,255,0.08)"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
