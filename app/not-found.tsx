"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        className="mb-6"
      >
        <AlertTriangle className="h-20 w-20 text-yellow-400 drop-shadow-lg" />
      </motion.div>

      {/* Main Text */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold tracking-tight mb-3"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-300 max-w-lg mb-8"
      >
        Oops! The page you’re looking for doesn’t exist or may have been moved.
        Try checking the URL or return to the home page.
      </motion.p>

      {/* Return Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-yellow-300 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back Home
        </Link>
      </motion.div>

      {/* Decorative Glowing Circle */}
      <div className="absolute -z-10 top-1/2 left-1/2 w-[400px] h-[400px] bg-yellow-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
