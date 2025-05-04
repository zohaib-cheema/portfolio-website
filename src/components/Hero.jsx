import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const container = (delay) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Hero = () => {
  return (
    <div className="py-28 px-4 flex flex-col items-center text-center">
      {/* Line 1 */}
      <motion.h2
        variants={container(0)}
        initial="hidden"
        animate="visible"
        className="text-5xl md:text-7xl font-bold text-white"
      >
        Hi there! I'm
      </motion.h2>

      {/* Line 2 */}
      <motion.h1
        variants={container(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-4 bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent text-7xl md:text-8xl font-semibold"
      >
        Zohaib Cheema
      </motion.h1>

      {/* Line 3 */}
      <motion.div
        variants={container(0.6)}
        initial="hidden"
        animate="visible"
        className="mt-6 text-3xl md:text-5xl font-semibold"
      >
        <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          <Typewriter
            words={[
              "Full Stack Developer",
              "React • Node • MongoDB",
              "Crafting Scalable Web Apps",
            ]}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={65}
            deleteSpeed={40}
            delaySpeed={1200}
          />
        </span>
      </motion.div>

      {/* Arrow in flow with spacing below */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="mt-32 text-white text-4xl animate-bounce"
        onClick={() => {}}
      >
        ↓
      </motion.button>
    </div>
  );
};

export default Hero;
