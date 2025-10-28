import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import profileImg from "../assets/about.jpg"; // Using your existing photo

const TraitsConvergence = () => {
  const containerRef = useRef(null);
  
  // Track scroll progress through this section
  // Animation only happens when section is in view and fills the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Lock when section reaches top of viewport
  });

  // Transform scroll progress into movement values
  // Each circle moves from its initial position to center (0, 0)
  // Animation progresses as user scrolls through this locked section
  // Spread out animation across the full scroll distance
  
  // Top circle (Collaborative Leader) - starts top center, further away
  const circle1X = useTransform(scrollYProgress, [0.1, 0.7], [0, 0]);
  const circle1Y = useTransform(scrollYProgress, [0.1, 0.7], [-180, 0]);
  
  // Bottom left circle (Continuous Learner) - starts bottom left
  const circle2X = useTransform(scrollYProgress, [0.1, 0.7], [-220, 0]);
  const circle2Y = useTransform(scrollYProgress, [0.1, 0.7], [140, 0]);
  
  // Bottom right circle (Problem Solver) - starts bottom right
  const circle3X = useTransform(scrollYProgress, [0.1, 0.7], [220, 0]);
  const circle3Y = useTransform(scrollYProgress, [0.1, 0.7], [140, 0]);
  
  // Opacity for trait text (fade out as circles merge)
  const traitsOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);
  
  // Opacity for merged content (fade in after merge)
  const mergedOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);
  
  // Scale for merged circle
  const mergedScale = useTransform(scrollYProgress, [0.7, 0.95], [0.8, 1]);

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
      ref={containerRef}
      className="relative h-[400vh] border-b border-neutral-900"
    >
      {/* Sticky container that holds position while animation plays */}
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center justify-start px-4 overflow-hidden pt-16">
        {/* Title - Higher z-index to stay above circles */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-20 mb-8 w-full text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent px-4"
        >
          What Drives Me
        </motion.h2>

        {/* Central container for circles - positioned below heading */}
        <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center z-10">
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
      </div>
    </section>
  );
};

export default TraitsConvergence;

