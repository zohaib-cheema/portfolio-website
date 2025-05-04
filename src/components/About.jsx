import aboutImg from "../assets/about.jpg";
import { ABOUT_TEXT } from "../constants";
import { motion } from "framer-motion";

const fadeIn = (x = 0, y = 0, delay = 0) => ({
  hidden: { opacity: 0, x, y },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const About = () => {
  return (
    <div className="border-b border-neutral-900 pb-24 px-4">
      <motion.h2
        variants={fadeIn(0, -40)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-20 text-center text-4xl font-bold"
      >
        About <span className="text-neutral-500">Me</span>
      </motion.h2>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row items-center gap-12 bg-neutral-900/30 rounded-2xl p-8 shadow-md backdrop-blur-md">
        {/* Image Section */}
        <motion.div
          variants={fadeIn(-60, 0, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
            <img
              src={aboutImg}
              alt="about"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <a
              href="https://linktr.ee/zohaib_cheema" // Replace with actual Linktree link
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold"
            >
              Visit My Linktree
            </a>
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          variants={fadeIn(60, 0, 0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <p className="text-neutral-200 text-lg md:text-xl leading-relaxed">
            {ABOUT_TEXT}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
