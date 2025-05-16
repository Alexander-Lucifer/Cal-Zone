'use client';

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { AuthRedirect } from "@/components/auth-redirect";
import { useEffect, useRef } from "react";
import { useAnimation } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useUser();

  // Testimonials Carousel
  const testimonials = [
    {
      name: "Alex P.",
      text: "Cal-Zone made tracking my meals fun and easy. I finally hit my nutrition goals!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya S.",
      text: "The insights and streaks keep me motivated every day. Love the design!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Jordan R.",
      text: "I never thought meal logging could be this smooth. The confetti is a great touch!",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
      name: "Sam T.",
      text: "The best nutrition app I've tried. The motivational quotes are a morning boost!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Lina M.",
      text: "Tracking calories is finally fun. The UI is beautiful and easy to use!",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      name: "Chris D.",
      text: "I love the gamified challenges. Cal-Zone keeps me coming back every day!",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    {
      name: "Maya F.",
      text: "Meal logging is so quick now. The streak orbs are super motivating!",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
      name: "Ben K.",
      text: "Finally, a nutrition app that feels fun and rewarding. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      // setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Calculate the width of one full set of testimonials
  const CARD_WIDTH = 360; // matches w-[360px]
  const GAP = 32; // gap-8 = 2rem = 32px
  const totalCards = testimonials.length;
  const loopWidth = totalCards * (CARD_WIDTH + GAP);

  // Seamless marquee animation
  const marqueeControls = useAnimation();
  const isAnimating = useRef(false);
  useEffect(() => {
    let cancelled = false;
    async function loopMarquee() {
      isAnimating.current = true;
      while (!cancelled) {
        await marqueeControls.start({ x: -loopWidth, transition: { duration: totalCards * 3, ease: 'linear' } });
        await marqueeControls.set({ x: 0 });
      }
      isAnimating.current = false;
    }
    loopMarquee();
    return () => { cancelled = true; };
  }, [loopWidth, totalCards, marqueeControls]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="w-full min-h-screen flex items-center justify-center sm:block">
        <div className="relative w-full max-w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden mx-auto flex flex-col md:rounded-none md:shadow-none md:max-w-none md:overflow-visible
          sm:max-w-[430px] sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          <AuthRedirect />
          <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 flex-1 flex flex-col">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 w-full max-w-2xl mx-auto px-2"
              >
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Cal-Zone
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Your next-gen diet companion that makes nutrition tracking effortless and enjoyable.
                  Transform your health journey with smart insights and personalized guidance.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full">
                  {!isSignedIn ? (
                    <>
                      <SignUpButton mode="modal">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold flex items-center gap-2"
                        >
                          Start Your Journey
                          <ArrowRightIcon className="w-5 h-5" />
                        </motion.button>
                      </SignUpButton>
                      <SignInButton mode="modal">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-3 border border-gray-600 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Sign In
                        </motion.button>
                      </SignInButton>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-semibold flex items-center gap-2"
                    >
                      Enter Cal-Zone
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-20 w-full max-w-5xl mx-auto px-2"
              >
                {[
                  {
                    title: "Smart Nutrition",
                    description: "AI-powered meal tracking that learns and adapts to your preferences",
                  },
                  {
                    title: "Real-time Insights",
                    description: "Get instant feedback and personalized recommendations for your diet",
                  },
                  {
                    title: "Health Journey",
                    description: "Track your progress with gamified challenges and achievements",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-blue-400">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Testimonials Carousel */}
              <div className="w-full mt-20 overflow-x-auto overflow-y-visible">
                <h2 className="text-2xl font-bold text-center text-blue-300 mb-8">What Our Users Say</h2>
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: 240, height: 280 }}>
                  <motion.div
                    className="flex gap-4 sm:gap-8 items-center w-full"
                    animate={marqueeControls}
                    style={{ width: `${loopWidth * 2}px` }}
                  >
                    {[...testimonials, ...testimonials].map((t, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[200px] sm:h-[220px] md:h-[240px] p-4 sm:p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl"
                        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
                      >
                        <Image src={t.avatar} alt={t.name} width={64} height={64} className="w-12 sm:w-16 h-12 sm:h-16 rounded-full mb-2 sm:mb-3 border-2 border-blue-400 shadow-md" />
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 italic mb-2 text-center font-medium drop-shadow">“{t.text}”</p>
                        <span className="text-blue-700 dark:text-blue-300 font-semibold mt-2">{t.name}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <footer className="w-full py-6 bg-white/10 backdrop-blur-lg border-t border-white/20 text-center text-gray-300 text-sm shadow-inner sm:rounded-b-3xl">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
              <span className="font-semibold tracking-wide text-blue-400">Cal-Zone</span>
              <span className="opacity-80">© {new Date().getFullYear()} Cal-Zone. All rights reserved.</span>
              <span className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
                <span className="mx-1 text-gray-400">·</span>
                <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                <span className="mx-1 text-gray-400">·</span>
                <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}