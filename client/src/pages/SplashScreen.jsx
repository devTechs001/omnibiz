import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

// Loading facts/tips component
const LoadingTip = ({ tips }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTip}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          💡 {tips[currentTip]}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Splash Screen Component
const SplashScreen = ({
  onComplete,
  duration = 12000, // Default 12 seconds
  minDuration = 15000, // Minimum display time
  theme = 'default',
  showFeatures = true,
  showParticles = true,
  showRings = true,
  showTips = true,
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
    { label: 'Initializing ominbiz...', icon: '🚀', duration: 2000 },
    { label: 'Loading core modules...', icon: '📦', duration: 2000 },
    { label: 'Connecting to database...', icon: '🗄️', duration: 2500 },
    { label: 'Fetching your data...', icon: '📥', duration: 2000 },
    { label: 'Setting up workspace...', icon: '🏗️', duration: 2000 },
    { label: 'Loading preferences...', icon: '⚙️', duration: 1500 },
    { label: 'Preparing dashboard...', icon: '📊', duration: 1500 },
    { label: 'Final touches...', icon: '✨', duration: 1000 },
    { label: 'Almost ready...', icon: '🎯', duration: 500 },
  ],
  tips = [
    "You can customize your dashboard by dragging widgets",
    "Use keyboard shortcuts to navigate faster",
    "Enable notifications to stay updated on orders",
    "Check out our new analytics features",
    "You can export reports in multiple formats",
    "Set up automated inventory alerts",
    "Integrate with your favorite payment gateways",
  ],
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const isMounted = useRef(true);
  const startTimeRef = useRef(Date.now());
  const controls = useAnimation();

  // Calculate actual duration (use the larger of duration or minDuration)
  const actualDuration = Math.max(duration, minDuration);

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

  // Handle skip functionality
  const handleSkip = useCallback(() => {
    if (!canSkip || isExiting) return;
    
    setIsExiting(true);
    setProgress(100);
    
    controls.start({
      scale: 1.05,
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    });

    setTimeout(() => {
      if (isMounted.current) {
        setIsVisible(false);
        onComplete?.();
      }
    }, 600);
  }, [canSkip, isExiting, controls, onComplete]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && canSkip) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSkip, handleSkip]);

  // Enable skip after 5 seconds
  useEffect(() => {
    const skipTimeout = setTimeout(() => {
      if (isMounted.current) {
        setCanSkip(true);
      }
    }, 5000);

    return () => clearTimeout(skipTimeout);
  }, []);

  // Main loading logic
  useEffect(() => {
    isMounted.current = true;
    const timeouts = [];
    startTimeRef.current = Date.now();

    // Calculate cumulative durations for steps - distribute evenly across total duration
    const totalStepsDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    let accumulatedTime = 0;

    const stepTimings = loadingSteps.map((step, index) => {
      // Calculate proportional duration based on total steps duration
      const proportionalDuration = (step.duration / totalStepsDuration) * actualDuration;
      const startTime = accumulatedTime;
      const endTime = accumulatedTime + proportionalDuration;

      // Ensure we don't exceed the actualDuration
      accumulatedTime = Math.min(endTime, actualDuration);

      return {
        startTime,
        endTime,
        index
      };
    });

    // Smooth progress animation - distribute evenly across duration
    const progressInterval = setInterval(() => {
      if (isMounted.current && !isExiting) {
        const elapsed = Date.now() - startTimeRef.current;
        setElapsedTime(elapsed);

        // Calculate linear progress based on elapsed time
        let targetProgress = (elapsed / actualDuration) * 100;

        // Cap progress at 100%
        targetProgress = Math.min(targetProgress, 100);

        setProgress(targetProgress);

        // Update current step based on timing
        const currentTiming = stepTimings.find(
          timing => elapsed >= timing.startTime && elapsed < timing.endTime
        );
        if (currentTiming && currentTiming.index !== currentStep) {
          setCurrentStep(currentTiming.index);
        }
      }
    }, 50);

    // Complete sequence - ensure we wait for full duration
    const completeTimeout = setTimeout(() => {
      if (isMounted.current && !isExiting) {
        // Ensure progress reaches 100%
        setProgress(100);
        setCurrentStep(loadingSteps.length - 1);

        // Wait a moment at 100% before transitioning
        const finalWait = setTimeout(() => {
          if (isMounted.current) {
            setIsExiting(true);

            controls.start({
              scale: 1.05,
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeInOut' },
            });

            const exitTimeout = setTimeout(() => {
              if (isMounted.current) {
                setIsVisible(false);
                onComplete?.();
              }
            }, 700);
            timeouts.push(exitTimeout);
          }
        }, 800); // Stay at 100% for 800ms
        timeouts.push(finalWait);
      }
    }, actualDuration);
    timeouts.push(completeTimeout);

    return () => {
      isMounted.current = false;
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [actualDuration, onComplete, controls, loadingSteps, isExiting]);

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
        delay: 2 + index * 0.15,
      },
    }),
    hover: {
      scale: 1.1,
      y: -5,
      transition: { type: 'spring', stiffness: 400 },
    },
  };

  // Format elapsed time
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  // Format remaining time
  const formatRemainingTime = () => {
    const remaining = Math.max(0, actualDuration - elapsedTime);
    const seconds = Math.ceil(remaining / 1000);
    return seconds > 0 ? `~${seconds}s remaining` : 'Ready!';
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
            className="relative flex flex-col items-center space-y-6 p-8 max-w-2xl mx-auto"
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
                <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-200/20 dark:border-gray-600/20 shadow-inner">
                  {/* Animated Progress Fill */}
                  <motion.div
                    className={`h-full ${currentTheme.progressBar} rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Stripes Animation */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                      }}
                      animate={{ backgroundPosition: ['0px 0px', '40px 0px'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>

                {/* Progress Indicator Dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-3 border-green-500 flex items-center justify-center"
                  style={{ left: `calc(${Math.min(progress, 97)}% - 12px)` }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.4)',
                      '0 0 0 10px rgba(34, 197, 94, 0)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Progress Info */}
              <div className="flex justify-between items-center text-sm px-1">
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {formatRemainingTime()}
                  </span>
                </motion.div>
                <motion.span
                  className="text-green-600 dark:text-green-400 font-bold text-xl tabular-nums"
                  key={Math.round(progress)}
                  initial={{ scale: 1.3, color: '#10b981' }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
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
                  className="flex items-center justify-center space-x-3 p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 shadow-lg"
                >
                  <motion.span
                    className="text-3xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {loadingSteps[currentStep]?.icon}
                  </motion.span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {loadingSteps[currentStep]?.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Step {currentStep + 1} of {loadingSteps.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Step Indicators */}
              <div className="flex justify-center items-center space-x-1.5 py-2">
                {loadingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={false}
                  >
                    <motion.div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index < currentStep
                          ? 'w-2 bg-green-500'
                          : index === currentStep
                          ? 'w-8 bg-gradient-to-r from-green-500 to-emerald-400'
                          : 'w-2 bg-gray-300 dark:bg-gray-600'
                      }`}
                      animate={
                        index === currentStep
                          ? {
                              boxShadow: [
                                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                                '0 0 8px 2px rgba(34, 197, 94, 0.3)',
                                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1, repeat: Infinity }}
                    />

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {step.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Loading Tips */}
            {showTips && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="w-full max-w-md"
              >
                <LoadingTip tips={tips} />
              </motion.div>
            )}

            {/* Feature Cards */}
            {showFeatures && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    custom={index}
                    variants={featureVariants}
                    whileHover="hover"
                    className="group relative flex flex-col items-center space-y-3 p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 cursor-pointer overflow-hidden shadow-lg"
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    {/* Icon */}
                    <motion.span
                      className="text-3xl relative z-10"
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
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
                { value: '10K+', label: 'Users', icon: '👥' },
                { value: '99.9%', label: 'Uptime', icon: '⚡' },
                { value: '24/7', label: 'Support', icon: '🛟' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3 + index * 0.2 }}
                  className="text-center group"
                >
                  <motion.div
                    className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center space-x-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <span className="text-lg">{stat.icon}</span>
                    <span>{stat.value}</span>
                  </motion.div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            className="absolute bottom-6 left-0 right-0 text-center space-y-3"
          >
            {/* Skip Button */}
            <AnimatePresence>
              {canSkip && !isExiting && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleSkip}
                  className="px-6 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105"
                >
                  <span className="flex items-center space-x-2">
                    <span>Skip</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">
                      ESC
                    </kbd>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Branding */}
            <div className="space-y-1">
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
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>All Systems Operational</span>
                </motion.span>
              </div>
            </div>

            {/* Elapsed Time (for debugging/display) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 5 }}
              className="text-xs text-gray-400"
            >
              Loaded in {formatTime(elapsedTime)}
            </motion.div>
          </motion.div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-400/20 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-400/20 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-400/20 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-400/20 rounded-br-3xl" />

          {/* Loading Spinner in Corner */}
          <motion.div
            className="absolute top-6 right-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              className="w-6 h-6 text-green-500/50"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;