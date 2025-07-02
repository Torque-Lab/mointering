"use client"

import { motion } from 'motion/react';
import { Monitor, Zap, Shield, Users } from 'lucide-react';
import { Button } from '../Button';
import { redirect } from 'next/navigation';

export default function AboutPage() {
  const stats = [
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '10K+', label: 'Active Websites' },
    { value: '50+', label: 'Countries' },
    { value: '24/7', label: 'Support' },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: '/team/alex.jpg',
      description: '10+ years in cloud infrastructure and monitoring solutions.',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: '/team/sarah.jpg',
      description: 'Former lead architect at major cloud platform.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      image: '/team/michael.jpg',
      description: 'Product specialist with focus on developer experience.',
    },
  ];

  return (
    <section className="py-20 mt-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            About SiteWatch
          </h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering businesses with reliable, real-time monitoring solutions to ensure your digital presence is always at its best.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              At SiteWatch, we believe that every business deserves reliable, real-time monitoring without the complexity. 
              Our mission is to provide powerful, yet simple tools that help you stay ahead of issues before they impact your users.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Founded in 2023, we've been helping businesses of all sizes maintain their digital presence with confidence.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                icon: <Monitor className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
                title: 'Real-time Monitoring',
                description: 'Instant alerts and comprehensive metrics.',
              },
              {
                icon: <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
                title: 'Lightning Fast',
                description: 'Built for speed and reliability.',
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
                title: 'Secure by Design',
                description: 'Your data is always protected.',
              },
              {
                icon: <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
                title: 'User-Centric',
                description: 'Designed with you in mind.',
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12"
          >
            Meet Our Team
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Users className="w-20 h-20" />
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-indigo-600 dark:text-indigo-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-10 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust SiteWatch to keep their digital presence running smoothly.
          </p>
          <div className='flex justify-center '> 
    <Button onClick={()=> redirect("/login")}variant='secondary' text='Get Started' className='cursor-pointer' />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
