import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Interactive bubbles in the center */}
      <div className="flex gap-20 items-center justify-center">
        {/* Study Mode Bubble */}
        <Link href="/study" className="group">
          <div className="relative w-72 h-72 cursor-pointer">
            {/* Main bubble */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/80 to-teal-600/90 rounded-full backdrop-blur-lg border border-cyan-300/30 
                          transition-all duration-500 ease-out
                          group-hover:scale-110 group-hover:from-cyan-300/90 group-hover:to-teal-500/95 
                          group-hover:shadow-2xl group-hover:shadow-cyan-500/40
                          group-active:scale-105">
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-6 left-8 w-3 h-3 bg-white/60 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-300"></div>
            <div className="absolute top-16 right-10 w-2 h-2 bg-white/40 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-500 delay-100"></div>
            <div className="absolute bottom-12 left-16 w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-400 delay-200"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-bold group-hover:text-cyan-100 transition-colors duration-300">Study</h3>
            </div>
            
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 group-hover:animate-ping"></div>
          </div>
        </Link>

        {/* Content Mode Bubble */}
        <Link href="/content" className="group">
          <div className="relative w-72 h-72 cursor-pointer">
            {/* Main bubble */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/80 to-indigo-600/90 rounded-full backdrop-blur-lg border border-violet-300/30 
                          transition-all duration-500 ease-out
                          group-hover:scale-110 group-hover:from-violet-300/90 group-hover:to-indigo-500/95 
                          group-hover:shadow-2xl group-hover:shadow-violet-500/40
                          group-active:scale-105">
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-8 right-6 w-3 h-3 bg-white/60 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-400"></div>
            <div className="absolute top-20 left-8 w-2 h-2 bg-white/40 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-600 delay-150"></div>
            <div className="absolute bottom-8 right-14 w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse 
                          group-hover:animate-bounce transition-all duration-500 delay-75"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-bold group-hover:text-violet-100 transition-colors duration-300">Create</h3>
            </div>
            
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 group-hover:animate-ping"></div>
          </div>
        </Link>
      </div>
    </main>
  );
}