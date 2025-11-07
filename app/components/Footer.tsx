"use client";

import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CreditCard,
  Shield,
  Headphones,
  Truck,
  Clock,
  Heart,
  Sparkles,
  Palette,
  Brush
} from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  const features = [
    { 
      icon: <Truck className="w-5 h-5" />, 
      text: "Free Shipping", 
      subtext: "On orders over $50",
      gradient: "from-blue-400 to-cyan-400"
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      text: "Secure Payment", 
      subtext: "100% protected",
      gradient: "from-green-400 to-emerald-400"
    },
    { 
      icon: <Shield className="w-5 h-5" />, 
      text: "2-Year Warranty", 
      subtext: "Quality guarantee",
      gradient: "from-purple-400 to-pink-400"
    },
    { 
      icon: <Headphones className="w-5 h-5" />, 
      text: "24/7 Support", 
      subtext: "Ready to help",
      gradient: "from-orange-400 to-red-400"
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      text: "Easy Returns", 
      subtext: "30-day policy",
      gradient: "from-yellow-400 to-amber-400"
    },
  ];

  const shopLinks = [
    { name: "New Arrivals", href: "/Product" },
    { name: "Best Sellers", href: "/Product" },
    { name: "Sale Items", href: "/Product" },
    { name: "Gift Cards", href: "/Product" },
    { name: "LookBook", href: "/Product" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Affiliate Program", href: "/affiliate" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQs", href: "/faq" },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook", color: "hover:bg-blue-500" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter", color: "hover:bg-sky-400" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", name: "Instagram", color: "hover:bg-pink-500" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", name: "LinkedIn", color: "hover:bg-blue-600" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", name: "YouTube", color: "hover:bg-red-500" },
  ];

  // Predefined particle positions to avoid hydration mismatch
  const particlePositions = [
    { x: 10, y: 20 },
    { x: 25, y: 60 },
    { x: 50, y: 30 },
    { x: 75, y: 80 },
    { x: 90, y: 40 },
    { x: 15, y: 70 },
    { x: 60, y: 10 },
    { x: 85, y: 90 },
    { x: 30, y: 50 },
    { x: 70, y: 60 },
    { x: 40, y: 20 },
    { x: 80, y: 70 },
    { x: 20, y: 80 },
    { x: 55, y: 40 },
    { x: 95, y: 30 }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles - Only render on client side */}
      {isMounted && (
        <div className="absolute inset-0">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              initial={{ 
                opacity: 0,
                scale: 0,
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [`${pos.x}%`, `${(pos.x + 30) % 100}%`],
                y: [`${pos.y}%`, `${(pos.y - 40 + 100) % 100}%`]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Features Bar */}
      <div className="border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group-hover:bg-white/10 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.text}</h3>
                  <p className="text-gray-300 text-sm">{feature.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="lg:col-span-2"
          >
            {/* Animated Logo */}
            <motion.div 
              className="flex items-center gap-3 mb-6 group"
              whileHover="hover"
            >
              <motion.div
                variants={{
                  hover: { rotate: 360, scale: 1.1 }
                }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  RS-Legacy
                </h1>
                <p className="text-gray-400 text-sm">Where Art Meets Fashion</p>
              </div>
            </motion.div>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Discover the intersection of <span className="text-purple-300">artistry</span> and <span className="text-pink-300">fashion</span>. 
              We craft experiences that transform your style into wearable masterpieces.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-8">
              <motion.h3 
                className="font-bold text-xl mb-4 flex items-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Join the Art Movement
              </motion.h3>
              <form onSubmit={handleSubscribe} className="relative">
                <motion.input
                  type="email"
                  placeholder="Enter your email for artistic insights..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg transition-all duration-300 hover:bg-white/10"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  <span>Create</span>
                  <Brush className="w-4 h-4" />
                </motion.button>
              </form>
            </div>

            {/* Contact Info */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: Mail, text: "art@stylehub.com" },
                { icon: MapPin, text: "123 Fashion Ave, Art District, NY" }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-all duration-300 group cursor-pointer p-3 rounded-xl hover:bg-white/5"
                  whileHover={{ x: 5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Links Sections */}
          {[
            { title: "Gallery", links: shopLinks, delay: 0.1 },
            { title: "Studio", links: companyLinks, delay: 0.2 },
            { title: "Support", links: supportLinks, delay: 0.3 },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: section.delay }}
            >
              <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: section.delay + linkIndex * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-3 group relative overflow-hidden p-2 rounded-lg"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span className="relative">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Connect
            </h3>
            
            {/* Social Media Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ${social.color} transition-all duration-300 flex items-center justify-center group relative overflow-hidden`}
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* App Download */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold mb-4 text-gray-300">Experience Our Art</h4>
              <div className="space-y-3">
                {["App Store", "Google Play"].map((store, index) => (
                  <motion.a
                    key={store}
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {store}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 text-gray-400 text-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-3 h-3 text-white" />
                </div>
                <span>© 2025 RS-Legacy</span>
              </motion.div>
              <span className="hidden lg:inline">•</span>
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                Crafted with <Heart className="w-4 h-4 text-red-400" /> by Artists
              </motion.span>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-6 text-sm"
            >
              {["Privacy Policy", "Terms of Service", "Cookies"].map((link, index) => (
                <motion.a
                  key={link}
                  href={`/${link.toLowerCase().replace(' ', '')}`}
                  className="text-gray-400 hover:text-white transition-all duration-300 relative group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;