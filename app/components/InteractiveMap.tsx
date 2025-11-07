// components/InteractiveMap.tsx
'use client';

import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimpleGoogleMap() {
  const storeLocation = {
    lat: 31.4180, // Your latitude
    lng: 73.0790, // Your longitude
    address: "D-type goal near bilali masjid , faisalabad,pv punjab, country: Pakistan 38000" // Your address
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${storeLocation.lat},${storeLocation.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeLocation.lat},${storeLocation.lng}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${storeLocation.lat},${storeLocation.lng}&zoom=15`;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Visit Our Store
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Come see us in person and experience our products firsthand
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="h-96 relative">
            {/* Simple Google Maps Embed */}
            <iframe
              src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${storeLocation.lat},${storeLocation.lng}&zoom=15&maptype=roadmap`}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '0' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RS-LEGACY Store Location"
            />
          </div>
          
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">RS-LEGACY Flagship Store</h3>
                <p className="text-gray-600">{storeLocation.address}</p>
                <p className="text-sm text-gray-500">Open Mon-Sun: 9:00 AM - 9:00 PM</p>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a 
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}