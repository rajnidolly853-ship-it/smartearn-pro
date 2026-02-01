import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

interface OfferwallCardProps {
  title: string;
  subtitle: string;
  reward: number;
  image: string;
  onPress: () => void;
  color?: string;
}

const OfferwallCard: React.FC<OfferwallCardProps> = ({
  title,
  subtitle,
  reward,
  image,
  onPress,
  color = 'from-purple-600 to-blue-600'
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className={`
        relative w-full aspect-[2/1] rounded-3xl overflow-hidden p-5
        flex flex-col justify-center
        bg-gradient-to-br ${color}
        cursor-pointer shadow-lg
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold backdrop-blur-md">
          Featured Offer
        </span>
        
        <h3 className="text-2xl font-display font-bold text-white mt-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-white/80 text-xs mt-1 max-w-[70%]">
          {subtitle}
        </p>
        
        <div className="mt-4 inline-flex items-center gap-2 bg-white text-dark-950 px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm">
          <span>+{reward} Coins</span>
        </div>
      </div>

      {/* Image (Right side) */}
      <img 
        src={image} 
        alt={title}
        className="absolute bottom-0 right-0 w-32 h-32 object-contain translate-x-4 translate-y-4 opacity-90"
      />
    </motion.div>
  );
};

export default OfferwallCard;
