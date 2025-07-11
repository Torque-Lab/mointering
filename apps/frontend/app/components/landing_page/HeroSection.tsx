'use client';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center relative bg-white overflow-hidden">
      <div className="max-w-7xl flex justify-center mx-auto lg:ml-4 ">
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
      <div className="relative w-full lg:w-[60%] h-auto lg:h-full flex justify-center lg:-mt-20 p-4">
    <Image
          src="/dashboard.png"
          alt="Website monitoring dashboard"
          width={1200}  
          height={950}  
          priority
          className="w-full h-auto lg:h-full bg-gray-50 rounded-xl shadow-2xl ring-1 ring-indigo-100 object-cover"
    />
</div>
    </section>
  );
}