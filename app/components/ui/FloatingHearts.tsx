// components/ui/FloatingHearts.tsx
'use client';

// import { motion } from 'framer-motion';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-300/30"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: '-50px',
          }}
        >
          <Heart size={24} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}