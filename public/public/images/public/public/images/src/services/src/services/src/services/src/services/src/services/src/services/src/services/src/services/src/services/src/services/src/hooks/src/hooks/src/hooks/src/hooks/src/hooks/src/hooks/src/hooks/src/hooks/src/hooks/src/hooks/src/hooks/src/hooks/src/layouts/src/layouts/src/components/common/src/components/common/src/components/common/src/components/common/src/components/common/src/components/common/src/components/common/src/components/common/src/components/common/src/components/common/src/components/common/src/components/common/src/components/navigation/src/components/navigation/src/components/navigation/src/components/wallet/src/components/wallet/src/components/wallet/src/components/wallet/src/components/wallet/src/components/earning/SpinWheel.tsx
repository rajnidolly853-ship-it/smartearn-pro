import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SpinWheelProps {
  prizes: number[];
  isSpinning: boolean;
  winningIndex: number | null;
  onSpinEnd?: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ 
  prizes, 
  isSpinning, 
  winningIndex,
  onSpinEnd 
}) => {
  const controls = useAnimation();
  const currentRotation = useRef(0);
  const totalSegments = prizes.length;
  const segmentAngle = 360 / totalSegments;

  // Colors for segments (alternating)
  const colors = ['#00ff88', '#00f5ff', '#ffd700', '#ff5555', '#a855f7', '#3b82f6', '#f97316', '#ec4899'];

  useEffect(() => {
    if (isSpinning && winningIndex !== null) {
      spinWheel(winningIndex);
    }
  }, [isSpinning, winningIndex]);

  const spinWheel = async (targetIndex: number) => {
    // Calculate rotation
    // We want the pointer (at top) to land on the target segment
    // Adjust logic based on where 0 degrees is (usually right (3 o'clock) in CSS)
    // Here we assume pointer is at Top (270deg visual, or -90deg)
    
    // Random extra spins (5 to 10 rotations)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 5));
    
    // Calculate angle to stop at
    // The wheel rotates clockwise. To bring index N to the top:
    // We need to rotate such that the segment is at the top.
    
    // Correction for pointer position
    const offset = 90; // Pointer is at top
    const targetAngle = (targetIndex * segmentAngle); 
    
    // Final rotation value
    const finalRotation = currentRotation.current + extraSpins + (360 - targetAngle) + offset;
    
    // Animate
    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 4,
        ease: [0.15, 0.85, 0.35, 1], // Custom bezier for realistic spin
      }
    });

    currentRotation.current = finalRotation % 360;
    
    // Trigger confetti if prize > 0
    if (prizes[targetIndex] > 0) {
      fireConfetti();
    }

    if (onSpinEnd) onSpinEnd();
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1500
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-8">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10">
        <img 
          src="/images/spin-pointer.svg" 
          alt="pointer" 
          className="w-full h-full drop-shadow-lg"
        />
      </div>

      {/* Wheel Container */}
      <motion.div
        animate={controls}
        className="w-full h-full rounded-full border-4 border-dark-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden bg-dark-900"
        style={{ transformOrigin: 'center' }}
      >
        {/* Segments */}
        {prizes.map((prize, index) => {
          const rotate = index * segmentAngle;
          const skew = 90 - segmentAngle; // Skew to make segment correct width

          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 w-[50%] h-[50%] origin-top-left"
              style={{
                transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
              }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center pt-8 pl-8"
                style={{
                  background: `linear-gradient(135deg, ${colors[index % colors.length]} 80%, rgba(0,0,0,0.2) 100%)`,
                  transform: `skewY(${skew}deg) rotate(${segmentAngle / 2}deg)`,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // Ensure clipping
                }}
              >
                <span className="text-dark-950 font-bold text-lg transform -rotate-90 origin-center">
                  {prize === 0 ? '☹️' : prize}
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Center Knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-dark-950 rounded-full border-4 border-neon-500 shadow-neon z-10 flex items-center justify-center">
           <span className="text-neon-500 text-xs font-bold">SPIN</span>
        </div>
      </motion.div>
      
      {/* Outer Glow Ring */}
      <div className="absolute -inset-4 rounded-full border border-white/5 pointer-events-none animate-pulse-slow" />
    </div>
  );
};

export default SpinWheel;
