import { useState } from 'react';
import { EtheralShadow } from './components/ui/etheral-shadow';
import { AuthForm } from './components/auth/AuthForm';
import { TextRotate } from './components/ui/text-rotate';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthForm />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <EtheralShadow
          color="rgba(30, 27, 75, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 0.2, scale: 1.2 }}
          sizing="fill"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-6xl mx-auto">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-6 tracking-tight leading-none">
            Clyp AI
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90 font-light tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] leading-relaxed">
            Watch Smarter, Learn Faster
          </p>
        </div>

        {/* Animated text section */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Instantly
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-6 py-3 rounded-xl shadow-2xl bg-[#1e2761] border border-white/10">
            <TextRotate
              texts={[
                'chat',
                'quiz',
                'learn',
                'save time',
                'summarize',
                'find answers',
                'solve doubts',
                'revise',
                'ask',
              ]}
              mainClassName="inline"
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={1800}
            />
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowAuth(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-xl shadow-2xl text-xl md:text-2xl transition-all duration-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:scale-105 border border-white/10"
        >
          Get Started
        </button>
        
        {/* Subtle description */}
        <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light">
          Transform any YouTube video into interactive learning experiences with AI-powered insights
        </p>
      </div>
    </div>
  );
} 