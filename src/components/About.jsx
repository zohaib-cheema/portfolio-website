import aboutImg from "../assets/about.jpg";
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
    <section
      id="about"
      className="px-6 sm:px-10 md:px-16 pb-32 pt-28 border-b border-neutral-900"
    >
      {/* Title */}
      <motion.h2
        variants={fadeIn(0, -40)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-10 text-center text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        About Me
      </motion.h2>

      {/* Container */}
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center lg:items-start bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-8 rounded-3xl shadow-lg gap-10">
        {/* Image with Linktree Hover */}
        <motion.div
          variants={fadeIn(-60, 0, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-[45%] h-full"
        >
          <div className="relative h-full overflow-hidden rounded-2xl shadow-md group">
            <img
              src={aboutImg}
              alt="Zohaib Cheema"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <a
              href="https://linktr.ee/zohaib_cheema"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold"
            >
              Visit My Linktree
            </a>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          variants={fadeIn(60, 0, 0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-[55%] flex flex-col justify-center text-neutral-200 text-lg md:text-xl space-y-6"
        >
          <p>
            Hey there! I’m Zohaib (Zo-hey-b), a Computer Science and Math student who loves building things that actually help people.
          </p>
          <p>
            Quick story: At my college orientation, one of the professors said something that stuck with me: “For the next four years, say ‘Yes, and’ to every challenge. The ‘and’ is how you’ll 🫵 add value.” That became my mindset. Whether it was leading 5+ student clubs, interning at Uber, planning 20+ events, or budgeting for various student orgs, I’ve always looked for the “and.”
          </p>
          <p>
            I’ve spent 180+ hours teaching coding to students and underserved communities because I believe tech should be for everyone. I’ve built 50+ technical projects (from web/mobile apps to analytical dashboards) that have helped solve real-world problems. And when I’m not deep in code, I’m either dancing or choreographing a dance performance 🕺. It’s my favorite creative outlet.
          </p>
          <p>
            If anything here sparks a convo, I’d love to hear from you! Reach out anytime at <span className="underline">zohaib.s.cheema92@gmail.com</span> 🙂
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
