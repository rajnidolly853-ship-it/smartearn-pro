import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { useLang } from '../hooks/useLanguage';
import { useNavigation } from '../context/NavigationContext';

const LanguageSelectionScreen: React.FC = () => {
  const { setLanguage } = useLang();
  const { navigate } = useNavigation();

  const handleSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    navigate('onboarding');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm text-center"
      >
        <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <span className="text-3xl">🌐</span>
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Choose Language
        </h1>
        <p className="text-gray-400 mb-8">
          Select your preferred language to continue
        </p>

        <div className="space-y-4">
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => handleSelect('en')}
            className="justify-between group hover:border-neon-500 hover:bg-neon-500/5"
            rightIcon={<span className="text-xl">🇬🇧</span>}
          >
            English
          </Button>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => handleSelect('hi')}
            className="justify-between group hover:border-neon-500 hover:bg-neon-500/5"
            rightIcon={<span className="text-xl">🇮🇳</span>}
          >
            हिंदी (Hindi)
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelectionScreen;
