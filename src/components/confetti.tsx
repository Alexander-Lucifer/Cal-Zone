'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; scale: number }>>([]);

  useEffect(() => {
    // Create 50 confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // Random x position between -50 and 50
      y: Math.random() * 100 - 50, // Random y position between -50 and 50
      rotation: Math.random() * 360, // Random rotation
      scale: Math.random() * 0.5 + 0.5, // Random scale between 0.5 and 1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: '50vw', 
              y: '50vh',
              opacity: 1,
              scale: particle.scale,
              rotate: particle.rotation
            }}
            animate={{ 
              x: `calc(50vw + ${particle.x}vw)`,
              y: `calc(50vh + ${particle.y}vh)`,
              opacity: 0,
              scale: 0,
              rotate: particle.rotation + 360
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2"
            style={{
              background: `hsl(${Math.random() * 360}, 100%, 50%)`,
              borderRadius: '50%'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 