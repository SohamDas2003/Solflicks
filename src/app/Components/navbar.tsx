"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search} from "lucide-react";
import TicketButton from "./contact-button";
import { gsap } from "gsap";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Films", href: "/films" },
  { name: "Series", href: "/series" },
  { name: "Behind the Scene", href: "/behind-the-scene" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef(null);
  const menuItemsRef = useRef<HTMLElement>(null);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Initial load animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      logoRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      0.2
    );

    if (menuItemsRef.current) {
      const items = menuItemsRef.current.querySelectorAll("a");
      tl.fromTo(
        items,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.4
      );
    }
  }, []);

  // Enhanced mobile menu animations
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        ".mobile-menu-item",
        { 
          x: -30, 
          opacity: 0,
          filter: "blur(5px)" 
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.1
        }
      );
    }
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
<header
  ref={navRef}
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolled || isMenuOpen ? "bg-black shadow-lg" : "bg-[#121212] bg-opacity-70 backdrop-blur-sm"
  }`}
>
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between h-[90px]">
          <Link href="/" ref={logoRef} className="text-white text-2xl font-bold">
            Solflicks Filmwork
          </Link>

          {/* Improved Hamburger Button */}
          <button
            className="lg:hidden text-white relative p-2 rounded-full z-[60] hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end justify-center space-y-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav ref={menuItemsRef} className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-white hover:text-gray-300 transition-colors text-lg relative group ${
                    isActive ? "font-medium" : ""
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* <button className="text-white transition-transform hover:scale-110">
              <Search size={24} />
            </button> */}
            <div className="gsap-nav-button">
              <TicketButton label="Contact" href="/contact" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Improved with transitions */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-50 transition-all duration-300 ${
          isMenuOpen ? " visible" : "opacity-0 invisible"
        }`}
      >
        <div className={`container mx-auto px-6 py-10 h-full flex flex-col transition-transform duration-500 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-10"
        }`}>
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-white text-2xl font-bold">
              Solflicks Filmwork
            </Link>
            
          </div>

          <nav className="flex flex-col">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-menu-item text-white text-2xl font-medium hover:text-[#671E45] transition-all opacity-0 py-4 border-b border-gray-800/30 ${
                  pathname === item.href ? "text-[#671E45]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    {pathname === item.href && "•"}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 border-t border-gray-800 mobile-menu-item opacity-0"
            style={{ transitionDelay: `${navItems.length * 50}ms` }}>
            <div className="flex flex-col space-y-5">

              <div className="flex justify-between items-center">
                {/* <button className="text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all">
                  <Search size={22} />
                </button> */}
                <div className="scale-110">
                  <TicketButton label="Contact" href="/contact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}