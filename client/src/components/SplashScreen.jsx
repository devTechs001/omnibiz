import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Logo from '@/components/ui/logo';
import { Progress } from '@/components/ui/progress';

// Particle component for background effects
const Particle = ({ index, color = 'green' }) => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const randomSize = useMemo(() => Math.random() * 4 + 2, []);
  const randomDuration = useMemo(() => Math.random() * 3 + 2, []);
  const randomDelay = useMemo(() => Math.random() * 2, []);

  const colorClasses = {
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
  };

  return (
    <motion.div
      className={`absolute rounded-full ${colorClasses[color]} opacity-30`}
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: randomSize,
        height: randomSize,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [-20, 20, -20],
        x: [-10, 10, -10],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Animated ring component
const PulsingRing = ({ delay = 0, size = 200 }) => (
  <motion.div
    className="absolute rounded-full border-2 border-green-400/20"
    style={{ width: size, height: size }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.5, 2],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
);

// Typing animation component
const TypeWriter = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const interval = setInterval(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearInterval(interval);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, speed]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-green-500 ml-1 align-middle"
      />
    </span>
  );
};

// Main Splash Screen Component
const SplashScreen = ({
  onComplete,
  duration = 4000,
  theme = 'default',
  showFeatures = true,
  showParticles = true,
  showRings = true,
  customLogo = null,
  title = 'Welcome to ominbiz',
  subtitle = 'Your Complete Business Management Solution',
  features = [
    { icon: '📊', label: 'Analytics', color: 'from-blue-500 to-cyan-500' },
    { icon: '🛒', label: 'Orders', color: 'from-green-500 to-emerald-500' },
    { icon: '👥', label: 'Customers', color: 'from-purple-500 to-pink-500' },
    { icon: '💰', label: 'Finance', color: 'from-yellow-500 to-orange-500' },
  ],
  loadingSteps = [
    { label: 'Initializing ominbiz...', icon: '🚀' },
    { label: 'Loading your workspace...', icon: '📁' },
    { label: 'Connecting to services...', icon: '🔗' },
    { label: 'Syncing your data...', icon: '🔄' },
    { label: 'Preparing dashboard...', icon: '📊' },
    { label: 'Almost ready...', icon: '✨' },
  ],
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const isMounted = useRef(true);
  const controls = useAnimation();

  // Theme configurations
  const themes = {
    default: {
      background: 'bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      accent: 'green',
      progressBar: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
      accent: 'blue',
      progressBar: 'bg-gradient-to-r from-blue-500 to-purple-500',
    },
    ocean: {
      background: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900',
      accent: 'blue',
      progressBar: 'bg-gradient-to-r from-blue-500 to-teal-500',
    },
    sunset: {
      background: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900 dark:via-red-900 dark:to-pink-900',
      accent: 'orange',
      progressBar: 'bg-gradient-to-r from-orange-500 to-pink-500',
    },
  };

  const currentTheme = themes[theme] || themes.default;

  useEffect(() => {
    isMounted.current = true;
    const timeouts = [];
    const stepDuration = duration / loadingSteps.length;

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      if (isMounted.current) {
        setProgress(prev => {
          const increment = 100 / (duration / 30);
          const newProgress = prev + increment;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, 30);

    // Step progression
    loadingSteps.forEach((_, index) => {
      if (index > 0) {
        const timeout = setTimeout(() => {
          if (isMounted.current) {
            setCurrentStep(index);
          }
        }, stepDuration * index);
        timeouts.push(timeout);
      }
    });

    // Complete sequence
    const completeTimeout = setTimeout(() => {
      if (isMounted.current) {
        setProgress(100);
        setIsExiting(true);

        // Trigger exit animation
        controls.start({
          scale: 1.05,
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        });

        const exitTimeout = setTimeout(() => {
          if (isMounted.current) {
            setIsVisible(false);
            onComplete?.();
          }
        }, 600);
        timeouts.push(exitTimeout);
      }
    }, duration);
    timeouts.push(completeTimeout);

    return () => {
      isMounted.current = false;
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [duration, onComplete, controls, loadingSteps.length]);

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.5 },
    },
  };

  // Item variants
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Logo variants
  const logoVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 1,
      },
    },
  };

  // Feature card variants
  const featureVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 1.5 + index * 0.1,
      },
    }),
    hover: {
      scale: 1.1,
      y: -5,
      transition: { type: 'spring', stiffness: 400 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${currentTheme.background}`}
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-[0.03]">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '50px 50px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-32 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-300/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Pulsing Rings */}
          {showRings && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <PulsingRing delay={0} size={200} />
              <PulsingRing delay={1} size={300} />
              <PulsingRing delay={2} size={400} />
            </div>
          )}

          {/* Particles */}
          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <Particle key={i} index={i} color={currentTheme.accent} />
              ))}
            </div>
          )}

          {/* Main Content */}
          <motion.div
            animate={controls}
            className="relative flex flex-col items-center space-y-8 p-8 max-w-2xl mx-auto"
          >
            {/* Logo Section */}
            <motion.div
              variants={logoVariants}
              className="relative"
            >
              {/* Logo Glow Effect */}
              <motion.div
                className="absolute inset-0 blur-2xl bg-green-400/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Logo */}
              {customLogo || (
                <Logo
                  size="2xl"
                  variant="full"
                  animated={true}
                  className="relative z-10"
                />
              )}

              {/* Orbiting Elements */}
              <motion.div
                className="absolute -inset-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
              </motion.div>
              <motion.div
                className="absolute -inset-12"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-3"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200%' }}
              >
                {title}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300"
              >
                {subtitle}
              </motion.p>
            </motion.div>

            {/* Enhanced Progress Section */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-md space-y-4"
            >
              {/* Progress Bar Container */}
              <div className="relative">
                {/* Background Progress Bar */}
                <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-200/20 dark:border-gray-600/20">
                  {/* Animated Progress Fill */}
                  <motion.div
                    className={`h-full ${currentTheme.progressBar} rounded-full relative overflow-hidden`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>

                {/* Progress Indicator Dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-green-500"
                  style={{ left: `calc(${progress}% - 10px)` }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.4)',
                      '0 0 0 8px rgba(34, 197, 94, 0)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              {/* Progress Info */}
              <div className="flex justify-between items-center text-sm">
                <motion.span
                  className="text-gray-500 dark:text-gray-400 font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading...
                </motion.span>
                <motion.span
                  className="text-green-600 dark:text-green-400 font-bold text-lg"
                  key={Math.round(progress)}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>

              {/* Current Step Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {loadingSteps[currentStep]?.icon}
                  </motion.span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {loadingSteps[currentStep]?.label}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-2">
                {loadingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? 'w-6 bg-green-500'
                        : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Feature Cards */}
            {showFeatures && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    custom={index}
                    variants={featureVariants}
                    whileHover="hover"
                    className="group relative flex flex-col items-center space-y-3 p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 cursor-pointer overflow-hidden"
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    {/* Icon */}
                    <motion.span
                      className="text-3xl relative z-10"
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      {feature.icon}
                    </motion.span>
                    
                    {/* Label */}
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 relative z-10">
                      {feature.label}
                    </span>

                    {/* Bottom Gradient Line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Quick Stats Preview */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center space-x-8 mt-4"
            >
              {[
                { value: '10K+', label: 'Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.5 }}
            className="absolute bottom-8 left-0 right-0 text-center space-y-2"
          >
            {/* Keyboard Shortcut Hint */}
            <motion.div
              className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Press</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono">
                ESC
              </kbd>
              <span>to skip</span>
            </motion.div>

            {/* Branding */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                ominbiz Technology
              </span>
            </p>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-400 dark:text-gray-500">
              <span>Version 2.0.0</span>
              <span>•</span>
              <span>© 2024</span>
              <span>•</span>
              <motion.span
                className="flex items-center space-x-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span>All Systems Operational</span>
              </motion.span>
            </div>
          </motion.div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-400/20 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-400/20 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-400/20 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-400/20 rounded-br-3xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;