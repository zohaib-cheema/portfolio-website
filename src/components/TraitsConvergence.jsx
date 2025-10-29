import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import profileImg from "../assets/about.jpg";

const TraitsConvergence = () => {
  const sectionRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Motion value to track animation progress (0 to 1)
  const progress = useMotionValue(0);
  
  // Track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Detect if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Transform progress into circle positions
  const circle1X = useTransform(progress, [0, 0.6], [0, 0]);
  const circle1Y = useTransform(progress, [0, 0.6], [-60, 0]); // Even closer for mobile
  
  const circle2X = useTransform(progress, [0, 0.6], [-140, 0]); // Much smaller horizontal spread for mobile
  const circle2Y = useTransform(progress, [0, 0.6], [80, 0]); // Much closer vertical distance for mobile
  
  const circle3X = useTransform(progress, [0, 0.6], [140, 0]); // Much smaller horizontal spread for mobile
  const circle3Y = useTransform(progress, [0, 0.6], [80, 0]); // Much closer vertical distance for mobile
  
  const traitsOpacity = useTransform(progress, [0.4, 0.6], [1, 0]);
  const mergedOpacity = useTransform(progress, [0.6, 0.9], [0, 1]);
  const mergedScale = useTransform(progress, [0.6, 0.9], [0.8, 1]);

  // ==========================================
  // DESKTOP SCROLL HANDLING (Wheel Events)
  // ==========================================
  useEffect(() => {
    if (isMobile) return; // Skip desktop logic on mobile
    
    const section = sectionRef.current;
    if (!section) return;

    let accumulatedDelta = 0;
    const DESKTOP_SCROLL_SENSITIVITY = 0.0008; // DESKTOP: Lower = more scrolling needed
    const DESKTOP_RESET_THRESHOLD = 0.05; // DESKTOP: Threshold for resetting animation

    // Intersection Observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !isLocked && !animationComplete) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.top > -100) {
              setIsLocked(true);
              accumulatedDelta = 0;
              progress.set(0);
              setAnimationComplete(false);
            }
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    observer.observe(section);

    const handleWheel = (e) => {
      // DESKTOP: If locked and animation not complete, hijack scroll
      if (isLocked && !animationComplete) {
        e.preventDefault();
        e.stopPropagation();

        // DESKTOP: Accumulate scroll delta
        accumulatedDelta += e.deltaY * DESKTOP_SCROLL_SENSITIVITY;
        accumulatedDelta = Math.max(0, Math.min(1, accumulatedDelta));

        // Update progress
        progress.set(accumulatedDelta);

        // DESKTOP: Check if animation is complete
        if (accumulatedDelta >= 0.99) {
          setAnimationComplete(true);
          setIsLocked(false);
        }
      }
      
      // DESKTOP: Allow scrolling backwards to reset
      if (isLocked && e.deltaY < 0 && accumulatedDelta <= DESKTOP_RESET_THRESHOLD) {
        setIsLocked(false);
        setAnimationComplete(false);
        accumulatedDelta = 0;
        progress.set(0);
      }
    };

    // DESKTOP: Add wheel event listener only
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isLocked, animationComplete, progress, isMobile]);

  // ==========================================
  // MOBILE TOUCH HANDLING (Touch Events + Flick Scroll)
  // ==========================================
  useEffect(() => {
    if (!isMobile) return; // Skip mobile logic on desktop
    
    const section = sectionRef.current;
    if (!section) return;

    let accumulatedDelta = 0;
    const MOBILE_TOUCH_SENSITIVITY = 0.0015; // MOBILE: Touch sensitivity
    const MOBILE_SCROLL_SENSITIVITY = 0.0006; // MOBILE: Flick scroll sensitivity
    const MOBILE_SWIPE_THRESHOLD = 10; // MOBILE: Min pixels to swipe before locking
    const MOBILE_RESET_THRESHOLD = 0.05; // MOBILE: Threshold for resetting animation
    let touchStartY = 0;
    let lastTouchY = 0;
    let lastScrollY = window.scrollY;
    let isFlickScrolling = false;

    // Intersection Observer to detect when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // MOBILE: Start when section is 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !isLocked && !animationComplete) {
            const rect = section.getBoundingClientRect();
            // MOBILE: Check if section is 50% visible (more than 50% in viewport)
            if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
              setIsLocked(true);
              accumulatedDelta = 0;
              progress.set(0);
              setAnimationComplete(false);
              isFlickScrolling = true;
              lastScrollY = window.scrollY;
            }
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7] } // MOBILE: Even more lenient thresholds
    );

    observer.observe(section);

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      
      // MOBILE: If locked, hijack touch scrolling and progress animation
      if (isLocked && !animationComplete) {
        e.preventDefault();
        e.stopPropagation();
        
        const deltaY = lastTouchY - touchY; // Positive when swiping up
        
        // MOBILE: Accumulate the delta
        accumulatedDelta += deltaY * MOBILE_TOUCH_SENSITIVITY;
        accumulatedDelta = Math.max(0, Math.min(1, accumulatedDelta));
        
        // Update progress
        progress.set(accumulatedDelta);
        
        // Update last touch position
        lastTouchY = touchY;
        
        // MOBILE: Check if animation is complete
        if (accumulatedDelta >= 0.99) {
          setAnimationComplete(true);
          setIsLocked(false);
          isFlickScrolling = false;
        }
      }
      
      // MOBILE: Allow scrolling backwards to reset
      if (isLocked && accumulatedDelta <= MOBILE_RESET_THRESHOLD) {
        const deltaY = lastTouchY - touchY;
        if (deltaY < 0) { // Swiping down
          setIsLocked(false);
          setAnimationComplete(false);
          accumulatedDelta = 0;
          progress.set(0);
          isFlickScrolling = false;
        }
      }
    };

    // MOBILE: Handle scroll hijacking and animation progress
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // MOBILE: If locked, hijack scroll and progress animation
      if (isLocked && !animationComplete) {
        const scrollDelta = currentScrollY - lastScrollY;
        
        // MOBILE: Restore scroll position to locked position (hijack the scroll)
        window.scrollTo(0, lastScrollY);
        
        // MOBILE: Use scroll attempt to progress animation
        accumulatedDelta += Math.abs(scrollDelta) * MOBILE_SCROLL_SENSITIVITY;
        accumulatedDelta = Math.max(0, Math.min(1, accumulatedDelta));
        
        // Update progress
        progress.set(accumulatedDelta);
        
        // MOBILE: Check if animation is complete
        if (accumulatedDelta >= 0.99) {
          setAnimationComplete(true);
          setIsLocked(false);
          isFlickScrolling = false;
        }
      }
      
      // MOBILE: Update last scroll position when not locked
      if (!isLocked) {
        lastScrollY = currentScrollY;
      }
    };

    // MOBILE: Add touch event listeners + scroll listener for scroll hijacking
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: false }); // Changed to false to allow preventDefault

    return () => {
      observer.disconnect();
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLocked, animationComplete, progress, isMobile]);

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
      className="relative flex flex-col items-center justify-start border-b border-neutral-900 pb-32 pt-20 px-4 sm:px-8 md:px-16"
      style={{ touchAction: isLocked ? 'none' : 'auto' }}
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
      <div className="relative w-full max-w-4xl flex items-center justify-center z-10 h-[320px] sm:h-[400px]" style={{ pointerEvents: 'none' }}>
        {/* Individual trait circles */}
        {traits.map((trait, index) => (
          <motion.div
            key={index}
            style={{
              x: trait.x,
              y: trait.y,
              pointerEvents: 'none'
            }}
            className="absolute"
          >
            {/* Circle with gradient border */}
            <motion.div
              style={{ opacity: traitsOpacity, pointerEvents: 'none' }}
              className={`relative w-28 h-28 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br ${trait.gradient} p-1 shadow-lg`}
            >
              {/* Inner circle */}
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center p-2 sm:p-6">
                <h3 className="text-white text-center text-xs sm:text-xl font-semibold leading-tight">
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
            pointerEvents: 'auto'
          }}
          className="absolute"
        >
          {/* Large merged circle */}
          <div className="relative w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-pink-300 via-slate-500 to-purple-500 p-1.5 shadow-2xl">
            {/* Inner circle with image and Linktree hover */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-neutral-950 group">
              <img
                src={profileImg}
                alt="Zohaib Cheema"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <a
                href="https://linktr.ee/zohaib_cheema"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-base sm:text-lg font-semibold"
              >
                Visit My Linktree
              </a>
            </div>
          </div>
          
          {/* Name below the circle */}
          <motion.div
            style={{ opacity: mergedOpacity }}
            className="absolute -bottom-12 sm:-bottom-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
          >
            <h2 className="text-lg sm:text-4xl font-bold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
              Zohaib Cheema
            </h2>
            <p className="text-neutral-400 text-xs sm:text-base mt-1 sm:mt-2">
              Full-Stack Engineer & Technical Leader
            </p>
          </motion.div>
        </motion.div>

      </div>

      {/* About Text Box - appears when profile picture fades in */}
      <motion.div
        style={{ opacity: mergedOpacity }}
        className="mt-12 sm:mt-16 w-full max-w-4xl mx-auto px-4"
      >
        <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-4 sm:p-6 rounded-3xl shadow-lg">
          <div className="text-neutral-200 text-sm sm:text-base md:text-lg space-y-3 sm:space-y-4">
            <p>
              Hey there! I'm Zohaib (Zo-hey-b), a Computer Science and Math student who loves building things that actually help people.
            </p>
            <p>
              Quick story: At my college orientation, one of the professors said something that stuck with me: "For the next four years, say 'Yes, and' to every challenge. The 'and' is how you'll 🫵 add value." That became my mindset. Whether it was leading 5+ student clubs, interning at Uber, planning 20+ events, or budgeting for various student orgs, I've always looked for the "and."
            </p>
            <p>
              I've spent 180+ hours teaching coding to students and underserved communities because I believe tech should be for everyone. I've built 50+ technical projects (from web/mobile apps to analytical dashboards) that have helped solve real-world problems. And when I'm not deep in code, I'm either dancing or choreographing a dance performance 🕺. It's my favorite creative outlet.
            </p>
            <p>
              If anything here sparks a convo, I'd love to hear from you! Reach out anytime at <span className="underline">zohaib.s.cheema9@gmail.com</span> 🙂
            </p>
          </div>
        </div>
      </motion.div>

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
