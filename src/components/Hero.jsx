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
  const scrollToSection = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="pt-[280px] pb-[240px] px-4 flex flex-col items-center text-center"
    >
      {/* Line 1 */}
      <motion.h2
        variants={container(0)}
        initial="hidden"
        animate="visible"
        className="text-6xl md:text-8xl font-bold text-white"
      >
        Hi there! I'm
      </motion.h2>

      {/* Line 2 */}
      <motion.h1
        variants={container(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-4 bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent text-8xl md:text-9xl font-semibold"
      >
        Zohaib Cheema
      </motion.h1>

{/* Line 3 - Typewriter */}
<motion.div
  variants={container(0.6)}
  initial="hidden"
  animate="visible"
  className="mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold max-w-screen-sm sm:max-w-none truncate"
>
  <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
    <Typewriter
      words={[
        "a SWE Intern at Uber",
        "a GDSC Lead",
        "a SWE Instructor at iD Tech",
        "a CS Major",
        "a Data Science Club Co-President",
        "a Bucknell Consultant",
        "a Full-Stack SWE Intern",
        "an App Dev Intern",
        "a Langone Scholar",
        "a Grand Challenges Scholar",
        "a Dancer & Choreographer",
        "a Creative Coder",
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

      {/* Scroll Arrow */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="mt-44 text-white text-4xl animate-bounce"
        onClick={scrollToSection}
      >
        ↓
      </motion.button>
    </section>
  );
};

export default Hero;
