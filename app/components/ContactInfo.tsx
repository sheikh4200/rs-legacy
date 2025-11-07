// app/components/Contact/ContactInfo.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Location",
      details: ["123 Commerce Street", "Suite 100", "New York, NY 10001"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Addresses",
      details: ["support@shopnow.com", "sales@shopnow.com"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 8:00 PM", "Saturday: 10:00 AM - 6:00 PM", "Sunday: 12:00 PM - 5:00 PM"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Social Media",
      details: ["Twitter: @shopnow", "Instagram: @shopnow", "Facebook: /shopnow"],
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Contact Information
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Here's how you can reach us. We're always happy to help!
        </p>
      </div>

      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex gap-4 group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <div className="space-y-1">
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-2">Emergency Support</h3>
        <p className="mb-4">For urgent matters outside business hours</p>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          <span className="font-semibold">+1 (555) 911-HELP</span>
        </div>
      </motion.div>
    </div>
  );
}