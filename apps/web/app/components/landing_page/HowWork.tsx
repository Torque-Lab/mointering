"use client";

import { motion } from 'motion/react';
import { Zap, Settings, BarChart2, CheckCircle } from 'lucide-react';

type StepProps = {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: StepProps[] = [
  {
    number: 1,
    title: 'Sign Up & Connect',
    description: 'Create your account and connect your website or application in just a few clicks.',
    icon: Zap,
  },
  {
    number: 2,
    title: 'Configure Monitoring',
    description: 'Set up your monitoring preferences and alerts based on your specific needs.',
    icon: Settings,
  },
  {
    number: 3,
    title: 'Get Real-time Insights',
    description: 'Access comprehensive dashboards with real-time metrics and performance data.',
    icon: BarChart2,
  },
  {
    number: 4,
    title: 'Stay Protected',
    description: 'Receive instant notifications and take action before issues affect your users.',
    icon: CheckCircle,
  },
];

const StepCard = ({ number, title, description, icon: Icon }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
      <span className="text-2xl font-bold">{number}</span>
      <Icon className="w-6 h-6 ml-2" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>
);

export default function HowWork() {
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
            Simple & Effective
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            How It Works
          </h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes and experience the power of professional website monitoring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-xl inline-block">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Ready to get started with professional monitoring?
            </p>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300">
              Start Your Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}