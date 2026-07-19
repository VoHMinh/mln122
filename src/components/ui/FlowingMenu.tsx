'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface FlowingMenuItemData {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: FlowingMenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

interface MenuItemProps extends FlowingMenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
}

const ANIMATION_DEFAULTS = { duration: 0.6, ease: 'expo' };

function distMetric(x: number, y: number, x2: number, y2: number) {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(mouseX: number, mouseY: number, width: number, height: number) {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
}

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#fff',
}: FlowingMenuProps) {
  return (
    <div className="flowing-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="flowing-menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-marquee__part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };
    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-marquee__part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;
      if (animationRef.current) { animationRef.current.kill(); }
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };
    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) { animationRef.current.kill(); }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = useCallback(
    (ev: React.MouseEvent) => {
      if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      gsap
        .timeline({ defaults: ANIMATION_DEFAULTS })
        .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    },
    []
  );

  const handleMouseLeave = useCallback(
    (ev: React.MouseEvent) => {
      if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      gsap
        .timeline({ defaults: ANIMATION_DEFAULTS })
        .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    },
    []
  );

  return (
    <div
      className="flowing-menu-item"
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        className="flowing-menu-item-link"
        href={link}
        style={{ color: textColor, borderTopColor: borderColor }}
      >
        {text}
      </a>
      <div
        className="flowing-marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="flowing-marquee__inner-wrap" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, i) => (
            <div
              key={i}
              className="flowing-marquee__part"
              style={{ color: marqueeTextColor }}
            >
              {text}
              <div
                className="flowing-marquee__img"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
