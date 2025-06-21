"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollManagerProps {
  children: React.ReactNode;
}

export default function ScrollManager({ children }: ScrollManagerProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize smooth scrolling with Lenis (modern alternative to Locomotive)
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Connect Lenis to GSAP's ScrollTrigger
    const connectLenisToScrollTrigger = () => {
      ScrollTrigger.update();
    };

    lenisRef.current?.on('scroll', connectLenisToScrollTrigger);

    // Animation loop
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    connectLenisToScrollTrigger();

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      
      // Clean up any ScrollTrigger instances
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}