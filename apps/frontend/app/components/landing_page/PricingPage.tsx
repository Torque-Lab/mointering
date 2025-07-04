"use client"

import React from "react";
import { Button } from "../Button";
import { redirect } from "next/navigation";

interface FeatureItemProps {
  text: string;
  included: boolean;
}

const FeatureItem = ({ text, included }: FeatureItemProps) => (
  <li className={`flex items-center ${included ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
    {included ? (
      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="h-5 w-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    {text}
  </li>
);

interface PricingCardProps {
  name: string;
  price: string;
  billingCycle: string;
  description: string;
  features: FeatureItemProps[];
  buttonText: string;
  featured?: boolean;
}

const PricingCard = ({
  name,
  price,
  billingCycle,
  description,
  features,
  buttonText,
  featured = false,
}: PricingCardProps) => {
  return (
    <div className={`flex flex-col cursor-pointer p-6 mx-auto max-w-lg text-center rounded-lg border shadow-lg ${featured ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} xl:p-8`}>
      {featured && (
        <div className="mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="mb-4 text-2xl font-semibold">{name}</h3>
      <p className="font-light text-gray-500 sm:text-lg">{description}</p>
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">{price}</span>
        <span className="text-gray-500">/{billingCycle}</span>
      </div>
      <ul role="list" className="mb-8 space-y-4 text-left">
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature.text} included={feature.included} />
        ))}
      </ul>
      <Button className={`w-full  cursor-pointer ${featured ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`} onClick={() => {redirect('/login')}}>
        {buttonText}
      </Button>
    </div>
  );
};

export default function PricingPage() {
  const pricingTiers = [
    {
      name: 'Starter',
      price: '$9',
      billingCycle: 'year',
      description: 'Perfect for individuals getting started',
      buttonText: 'Get started',
      features: [
        { text: '5 projects', included: true },
        { text: 'Real time alerts', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: false },
        { text: 'Analytics', included: false },
      ],
    },
    {
      name: 'Professional',
      price: '$29',
      billingCycle: 'year',
      description: 'For growing teams and businesses',
      buttonText: 'Start free trial',
      featured: true,
      features: [
        { text: '15 projects', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Real time alerts', included: true },
        { text: '24/7 Email support', included: true },
        { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Enterprise',
      price: '$99',
      billingCycle: 'year',
      description: 'For large scale applications',
      buttonText: 'Start free trial',
      features: [
        { text: 'Unlimited projects', included: true },
        { text: 'Priority support', included: true },
        { text: '24/7 Email/Phone support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Real time alerts', included: true },
      ],
    },
  ];

  return (
    <section className="bg-white py-12 mt-28 mb-28 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-4 mx-auto mt-12 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            Need a custom plan?{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

