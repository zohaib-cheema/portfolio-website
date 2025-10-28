import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import profileImg from "../assets/about.jpg";

const TraitsConvergence = () => {
  const sectionRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // Motion value to track animation progress (0 to 1)
  const progress = useMotionValue(0);
  
  // Track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Transform progress into circle positions
  const circle1X = useTransform(progress, [0, 0.6], [0, 0]);
  const circle1Y = useTransform(progress, [0, 0.6], [-100, 0]); // Reduced from -180 to give more space from heading
  
  const circle2X = useTransform(progress, [0, 0.6], [-220, 0]);
  const circle2Y = useTransform(progress, [0, 0.6], [180, 0]); // Increased from 140 to balance
  
  const circle3X = useTransform(progress, [0, 0.6], [220, 0]);
  const circle3Y = useTransform(progress, [0, 0.6], [180, 0]); // Increased from 140 to balance
  
  const traitsOpacity = useTransform(progress, [0.4, 0.6], [1, 0]);
  const mergedOpacity = useTransform(progress, [0.6, 0.9], [0, 1]);
  const mergedScale = useTransform(progress, [0.6, 0.9], [0.8, 1]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let accumulatedDelta = 0;
    const scrollSensitivity = 0.0008; // Lower = more scrolling needed
    const touchSensitivity = 0.003; // Touch sensitivity for mobile
    let touchStartY = 0;

    const handleWheel = (e) => {
      const rect = section.getBoundingClientRect();

      // Check if we're at the section
      if (rect.top <= 100 && rect.top >= -10 && !isLocked) {
        setIsLocked(true);
        accumulatedDelta = 0;
        progress.set(0);
        setAnimationComplete(false);
      }

      // If locked and animation not complete, hijack scroll
      if (isLocked && !animationComplete) {
        e.preventDefault();
        e.stopPropagation();

        // Accumulate scroll delta
        accumulatedDelta += e.deltaY * scrollSensitivity;
        accumulatedDelta = Math.max(0, Math.min(1, accumulatedDelta));

        // Update progress
        progress.set(accumulatedDelta);

        // Check if animation is complete
        if (accumulatedDelta >= 0.99) {
          setAnimationComplete(true);
          setIsLocked(false);
        }
      }
      
      // Allow scrolling backwards to reset
      if (isLocked && e.deltaY < 0 && accumulatedDelta <= 0) {
        setIsLocked(false);
        progress.set(0);
      }
    };

    const handleTouchStart = (e) => {
      const rect = section.getBoundingClientRect();
      
      // Check if we're at the section
      if (rect.top <= 100 && rect.top >= -10 && !isLocked) {
        setIsLocked(true);
        accumulatedDelta = 0;
        progress.set(0);
        setAnimationComplete(false);
      }
      
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isLocked && !animationComplete) {
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY; // Positive when swiping up
        
        // Accumulate the delta
        accumulatedDelta += deltaY * touchSensitivity;
        accumulatedDelta = Math.max(0, Math.min(1, accumulatedDelta));
        
        // Update progress
        progress.set(accumulatedDelta);
        
        // Update touch start for next move
        touchStartY = touchY;
        
        // Check if animation is complete
        if (accumulatedDelta >= 0.99) {
          setAnimationComplete(true);
          setIsLocked(false);
        }
      }
      
      // Allow scrolling backwards to reset
      if (isLocked && accumulatedDelta <= 0) {
        setIsLocked(false);
        progress.set(0);
      }
    };

    // Add event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLocked, animationComplete, progress]);

  const traits = [
    { 
      title: "Collaborative Leader", 
      x: circle1X, 
      y: circle1Y,
      gradient: "from-pink-400 to-pink-600"
    },
    { 
      title: "Continuous Learner", 
      x: circle2X, 
      y: circle2Y,
      gradient: "from-slate-400 to-slate-600"
    },
    { 
      title: "Problem Solver", 
      x: circle3X, 
      y: circle3Y,
      gradient: "from-purple-400 to-purple-600"
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="traits"
      className="relative flex flex-col items-center justify-start border-b border-neutral-900 pb-24 pt-20 px-4 sm:px-8 md:px-16"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-20 mb-12 w-full text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent px-4"
      >
        What Drives Me
      </motion.h2>

      {/* Central container for circles */}
      <div className="relative w-full max-w-4xl flex items-center justify-center z-10 h-[450px] sm:h-[550px]">
        {/* Individual trait circles */}
        {traits.map((trait, index) => (
          <motion.div
            key={index}
            style={{
              x: trait.x,
              y: trait.y,
            }}
            className="absolute"
          >
            {/* Circle with gradient border */}
            <motion.div
              style={{ opacity: traitsOpacity }}
              className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br ${trait.gradient} p-1 shadow-lg`}
            >
              {/* Inner circle */}
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center p-6">
                <h3 className="text-white text-center text-lg sm:text-xl font-semibold leading-tight">
                  {trait.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Merged circle with profile */}
        <motion.div
          style={{
            opacity: mergedOpacity,
            scale: mergedScale,
          }}
          className="absolute"
        >
          {/* Large merged circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-pink-300 via-slate-500 to-purple-500 p-1.5 shadow-2xl">
            {/* Inner circle with image */}
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-neutral-950">
              <img
                src={profileImg}
                alt="Zohaib Cheema"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Name below the circle */}
          <motion.div
            style={{ opacity: mergedOpacity }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
              Zohaib Cheema
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2">
              Full-Stack Engineer & Technical Leader
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint - only show when locked */}
      {isLocked && !animationComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-8 text-neutral-500 text-sm"
        >
          Keep scrolling...
        </motion.div>
      )}
    </section>
  );
};

export default TraitsConvergence;
