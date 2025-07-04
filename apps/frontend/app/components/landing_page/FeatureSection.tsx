'use client';

import { motion } from 'motion/react';
import { Monitor, Bell, BarChart2, Zap, Shield, Server } from 'lucide-react';
import { redirect } from 'next/navigation';

const features = [
  {
    icon: <Monitor className="w-8 h-8 text-indigo-600" />,
    title: 'Real-time Monitoring',
    description: 'Get instant alerts when your website experiences downtime or performance issues.'
  },
  {
    icon: <Bell className="w-8 h-8 text-indigo-600" />,
    title: 'Instant Alerts',
    description: 'Receive notifications via email, SMS, or Slack when issues are detected.'
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
    title: 'Performance Metrics',
    description: 'Track response times, uptime history, and performance trends over time.'
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: 'Lightning Fast',
    description: 'Our global monitoring network ensures fast and accurate status checks.'
  },
  {
    icon: <Shield className="w-8 h-8 text-indigo-600" />,
    title: 'SSL Monitoring',
    description: 'Get alerts before your SSL certificates expire to prevent security issues.'
  },
  {
    icon: <Server className="w-8 h-8 text-indigo-600" />,
    title: 'API Access',
    description: 'Integrate with your existing tools using our powerful API.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export function FeatureSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to monitor your websites and applications with confidence.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 mb-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-6">And many more features to help you stay on top of your website's health</p>
          <button className="px-8 py-3 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium" onClick={() => redirect('/features')}>
            View All Features 
          </button>
        </motion.div>
      </div>
    </section>
  );
}