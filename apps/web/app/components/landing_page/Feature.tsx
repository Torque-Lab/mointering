"use client";

import { motion } from 'motion/react';
import {  Shield, Users, Clock, BarChart, Lightbulb, Workflow } from 'lucide-react';

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
};

const features = [
  {
    title: 'Real-time Monitoring',
    description: 'Get instant updates and live tracking of all your critical metrics and performance indicators in one centralized dashboard.',
    icon: BarChart,
  },
  {
    title: 'Advanced Security',
    description: 'Enterprise-grade security with end-to-end encryption and multi-factor authentication to keep your data safe.',
    icon: Shield,
  },
  {
    title: 'Team Collaboration',
    description: 'Seamlessly collaborate with your team members with real-time updates and shared workspaces.',
    icon: Users,
  },
  {
    title: 'Automated Workflows',
    description: 'Streamline your processes with customizable automation that saves time and reduces manual work.',
    icon: Workflow,
  },
  {
    title: '24/7 Availability',
    description: 'Our platform is always up and running with 99.9% uptime guarantee and 24/7 support.',
    icon: Clock,
  },
  {
    title: 'Smart Insights',
    description: 'Get intelligent recommendations and predictive analytics to make data-driven decisions.',
    icon: Lightbulb,
  },
];

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
    <a
      href="#"
      className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
    >
      Learn more
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </motion.div>
);

export default function Feature() {
  return (
    <section className="py-20 mt-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4">
            Powerful Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive suite of tools is designed to help you monitor, analyze, and optimize your digital presence with ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Ready to experience the power of our platform?
          </p>
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300">
            Get Started Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}