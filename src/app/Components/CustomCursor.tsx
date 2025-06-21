"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", updatePosition);
    document.addEventListener("mouseleave", () => setHidden(true));
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add link hover effects
    const links = document.querySelectorAll("a, button");
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHoverStart);
      link.addEventListener("mouseleave", handleLinkHoverEnd);
    });

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", updatePosition);
      document.removeEventListener("mouseleave", () => setHidden(true));
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      // Clean up link hover effects
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHoverStart);
        link.removeEventListener("mouseleave", handleLinkHoverEnd);
      });
    };
  }, []);

  // Use GSAP for smoother cursor animation
  useEffect(() => {
    gsap.to(".cursor-dot", {
      x: position.x,
      y: position.y,
      duration: 0.1,
      ease: "power1.out",
    });

    gsap.to(".cursor-ring", {
      x: position.x,
      y: position.y,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [position]);

  return (
    <>
      <div
        className={`cursor-dot fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference ${
          hidden ? "opacity-0" : "opacity-100"
        } transition-opacity duration-150`}
      ></div>
      <div
        className={`cursor-ring fixed top-0 left-0 w-4 h-4 border-2 border-white rounded-full pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference ${
          hidden ? "opacity-0" : "opacity-100"
        } ${clicked ? "scale-75" : ""} ${
          linkHovered ? "scale-150" : ""
        } transition-all duration-150`}
      ></div>
    </>
  );
}