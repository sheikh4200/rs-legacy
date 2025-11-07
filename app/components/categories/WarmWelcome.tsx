// components/categories/WarmWelcome.tsx
'use client';

import { motion } from 'framer-motion';
import { Flower2, Coffee, Home } from 'lucide-react';

export function WarmWelcome() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="relative container mx-auto px-4 -mt-4 mb-12"
    >
      <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 rounded-2xl p-8 lg:p-12 border border-rose-200/50 shadow-lg shadow-rose-100/30">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Comfort */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Home className="text-rose-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-rose-800">Comfort First</h3>
            <p className="text-rose-600/80 font-light">
              Products designed to make your space feel like home
            </p>
          </motion.div>

          {/* Quality */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Flower2 className="text-amber-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-amber-800">Thoughtful Quality</h3>
            <p className="text-amber-600/80 font-light">
              Every item chosen with care and attention to detail
            </p>
          </motion.div>

          {/* Experience */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <Coffee className="text-orange-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-orange-800">Loving Experience</h3>
            <p className="text-orange-600/80 font-light">
              Shopping that feels personal and heartwarming
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}