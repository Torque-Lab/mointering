'use client';

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Monitor Your Websites</span>
                <span className="block text-indigo-600">in Real-Time</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Get instant alerts when your website goes down. Monitor uptime, performance, and get detailed analytics—all in one place.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link 
                    href="/signup"
                    className="w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started - It&apos;s Free
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link 
                    href="/features"
                    className="w-full inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex -space-x-1 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600">U{i}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-medium">Trusted by</span> 1000+ businesses worldwide
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-l-3xl flex items-center justify-center">
          <div className="relative w-4/5 h-4/5">
            {/* Placeholder for hero illustration */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center">
              <span className="text-indigo-400 text-lg font-medium">Website Monitoring Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}