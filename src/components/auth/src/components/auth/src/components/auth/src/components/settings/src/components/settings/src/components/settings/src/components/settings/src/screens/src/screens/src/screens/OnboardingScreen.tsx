import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import { setOnboardingComplete } from '../services/storage.service';
import Button from '../components/common/Button';

const slides = [
  {
    id: 1,
    title: "Discover & Earn",
    description: "Complete simple tasks, play games, and watch videos to earn real coins instantly.",
    image: "/images/onboarding-1.svg"
  },
  {
    id: 2,
    title: "Multiple Ways to Win",
    description: "Daily check-ins, spin wheel, and referral bonuses await you every single day.",
    image: "/images/onboarding-2.svg"
  },
  {
    id: 3,
    title: "Fast Withdrawals",
    description: "Withdraw your earnings directly to UPI, Paytm, or Gift Cards within 24 hours.",
    image: "/images/onboarding-3.svg"
  }
];

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { navigate } = useNavigation();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    setOnboardingComplete();
    navigate('login');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-safe-top right-4 z-20 mt-4">
        <button 
          onClick={finishOnboarding}
          className="text-gray-500 text-sm font-medium hover:text-white px-3 py-1"
        >
          Skip
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            {/* Image */}
            <div className="w-full aspect-square mb-8 relative">
              <div className="absolute inset-0 bg-neon-500/5 rounded-full blur-3xl" />
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title} 
                className="w-full h-full object-contain relative z-10"
              />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="p-6 pb-10 w-full max-w-md mx-auto relative z-10">
        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`
                h-2 rounded-full transition-all duration-300
                ${currentSlide === idx ? 'w-8 bg-neon-500' : 'w-2 bg-dark-800'}
              `}
            />
          ))}
        </div>

        {/* Button */}
        <Button 
          variant="primary" 
          fullWidth 
          size="lg" 
          onClick={handleNext}
          className="shadow-neon"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
