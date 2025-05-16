'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  type: 'ribbon' | 'streamer';
  opacity: number;
  burstIndex: number;
  drift: number;
}

const COLORS = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage green
  '#FFEEAD', // cream
  '#D4A5A5', // dusty rose
  '#9B59B6', // purple
  '#3498DB', // blue
  '#E74C3C', // red
  '#2ECC71', // green
  '#F1C40F', // yellow
  '#1ABC9C', // teal
  '#FFD700', // gold
];

const BURST_CONFIG = {
  totalParticles: 150,
  bursts: 5,
  delayBetweenBursts: 200, // ms
  minSize: 10,
  maxSize: 28,
  minDrift: -60,
  maxDrift: 60,
  minY: 0,
  maxY: 120,
  minOpacity: 0.5,
  maxOpacity: 1,
  streamerRatio: 0.25, // 25% streamers, 75% ribbons
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function ConfettiBurst({ isDevMode = false }: { isDevMode?: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateBurst = (burstIndex: number) => {
    const particlesPerBurst = Math.floor(BURST_CONFIG.totalParticles / BURST_CONFIG.bursts);
    const newParticles: ConfettiParticle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;

    for (let i = 0; i < particlesPerBurst; i++) {
      // Spherical cloud distribution
      const theta = randomBetween(0, 2 * Math.PI); // angle around center
      const r = Math.sqrt(Math.random()) * (window.innerWidth / 3); // more density in center
      const x = centerX + Math.cos(theta) * r;
      const y = centerY + Math.sin(theta) * r * 0.5 + randomBetween(BURST_CONFIG.minY, BURST_CONFIG.maxY);
      const size = randomBetween(BURST_CONFIG.minSize, BURST_CONFIG.maxSize);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const rotation = randomBetween(0, 360);
      const type: 'ribbon' | 'streamer' = Math.random() < BURST_CONFIG.streamerRatio ? 'streamer' : 'ribbon';
      const opacity = randomBetween(BURST_CONFIG.minOpacity, BURST_CONFIG.maxOpacity);
      const drift = randomBetween(BURST_CONFIG.minDrift, BURST_CONFIG.maxDrift);

      newParticles.push({
        id: burstIndex * particlesPerBurst + i,
        x,
        y,
        color,
        size,
        rotation,
        type,
        opacity,
        burstIndex,
        drift,
      });
    }
    return newParticles;
  };

  const triggerConfetti = () => {
    setIsPlaying(true);
    for (let i = 0; i < BURST_CONFIG.bursts; i++) {
      setTimeout(() => {
        const burstParticles = generateBurst(i);
        setParticles(prev => [...prev, ...burstParticles]);
      }, i * BURST_CONFIG.delayBetweenBursts);
    }
    // Play fanfare sound
    const audio = new Audio('/fanfare.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // ignore
    });
    setTimeout(() => {
      setIsPlaying(false);
      setParticles([]);
    }, 3000 + (BURST_CONFIG.bursts * BURST_CONFIG.delayBetweenBursts));
  };

  // Streamer SVG path (wiggle)
  const Streamer = ({ color, size, rotation, opacity }: { color: string; size: number; rotation: number; opacity: number }) => (
    <svg width={size} height={size * 2.5} style={{ transform: `rotate(${rotation}deg)` }}>
      <path
        d={`M${size / 2},0 Q${size},${size} ${size / 2},${size * 1.2} Q0,${size * 2} ${size / 2},${size * 2.5}`}
        stroke={color}
        strokeWidth={size / 6}
        fill="none"
        opacity={opacity}
      />
    </svg>
  );

  return (
    <>
      {isDevMode && (
        <button
          onClick={triggerConfetti}
          disabled={isPlaying}
          className="fixed bottom-4 right-4 z-[9999] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? '🎉 Playing...' : '🎉 Test Confetti'}
        </button>
      )}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity,
              rotate: particle.rotation,
              scale: particle.type === 'streamer' ? 1.1 : 1,
            }}
            animate={{
              x: particle.x + particle.drift,
              y: window.innerHeight + 100,
              opacity: 0,
              rotate: particle.rotation + (particle.type === 'streamer' ? 180 : 90),
              scale: 0.8,
            }}
            transition={{
              duration: 3,
              ease: 'easeOut',
              delay: particle.burstIndex * (BURST_CONFIG.delayBetweenBursts / 1000),
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.type === 'streamer' ? particle.size * 2.5 : particle.size * 0.4,
              opacity: particle.opacity,
              zIndex: 9998,
              pointerEvents: 'none',
            }}
          >
            {particle.type === 'streamer' ? (
              <Streamer color={particle.color} size={particle.size} rotation={particle.rotation} opacity={particle.opacity} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: particle.color,
                  borderRadius: particle.size * 0.15,
                  boxShadow: `0 0 ${particle.size / 2}px ${particle.color}`,
                  opacity: particle.opacity,
                  transform: `rotate(${particle.rotation}deg)`
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
} 