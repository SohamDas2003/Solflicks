"use client"

import { useEffect, useState } from "react"
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CounterItemProps {
  end: number
  label: string
  suffix?: string
  showDivider?: boolean
  index: number
  inView: boolean
}

function CounterItem({ end, label, suffix = '', showDivider = true, index, inView }: CounterItemProps) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    const duration = 2000
    const steps = 60
    const stepValue = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end, inView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1
      }}
      className="relative flex flex-col"
    >
      <div className={`w-full flex flex-col items-center text-center md:${
      index === 0 ? 'items-center text-center' : 
      index === 1 ? 'items-center text-center' :
      index === 2 ? 'items-center text-center' :
      index === 3 ? 'items-center text-right' : ''
      }`}
      > 
      <div className="font-clash font-[800] text-[40px] md:text-[50px] leading-[100%] tracking-[0.02em] lg:text-[64px] text-[#FFFFFF] mb-2">
        {count}{suffix}
      </div>
      <div className="font-clash font-[400] text-[16px] md:text-[18px] lg:text-[24px] text-[#FFFFFF]">
        {label}
      </div>
      </div>
      {showDivider && (
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-10 md:h-12 w-px bg-[#FFFFFF] hidden md:block`} />
      )}
    </motion.div>
  )
}

export function CounterSection() {
  const [ref, inView] = useInView({ 
    threshold: 0.2,
    triggerOnce: false // This ensures animations trigger each time component enters viewport
  });
  
  const stats = [
    { end: 15, label: "Projects Produced", suffix: ' +' },
    { end: 5, label: "Countries Covered", suffix: '+' },
    { end: 10, label: "Festival Selections", suffix: '+' },
    { end: 100, label: "Crew Members", suffix: '+' },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-[#161C20] py-12 md:py-16 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <CounterItem
              key={index}
              index={index}
              end={stat.end}
              label={stat.label}
              suffix={stat.suffix}
              showDivider={index < stats.length - 1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}