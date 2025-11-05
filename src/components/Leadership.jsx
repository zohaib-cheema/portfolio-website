import { motion } from "framer-motion";

const LEADERSHIP = [
  {
    org: "Google Developer Student Club",
    role: "Founder & Lead",
    location: "Lewisburg, PA",
    duration: "Aug 2023 – Jun 2024",
    description:
      "Taught full-stack app development using Next.js to students after founding GDSC chapter at Bucknell University. Worked closely with Google representatives to organize 6+ expert-led talks that shaped the club's long-term goals and technical direction.",
  },
  {
    org: "Bucknell Consulting Group",
    role: "President",
    location: "Lewisburg, PA",
    duration: "Jan 2023 – Dec 2023",
    description:
      "Directed 3 tech-consulting projects with student teams, delivering innovative, data-driven solutions for local businesses. Conducted over 10 workshops in collaboration with industry experts to strengthen member capabilities in IT strategy, analytics, and client communications.",
  },
  {
    org: "Bucknell Data Science Club",
    role: "Co-President",
    location: "Lewisburg, PA",
    duration: "Oct 2022 – Aug 2023",
    description:
      "Led 3 university hackathons and facilitated 8+ sessions focusing on real-world applications of Python, TensorFlow, and Tableau. Encouraged student engagement and data storytelling using tools like Jupyter and Matplotlib.",
  },
];

const Leadership = () => {
  return (
    <section
      id="leadership"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      {/* Title */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Leadership Experience
      </motion.h2>

      <div className="flex flex-col items-center space-y-8 sm:space-y-10">
        {LEADERSHIP.map((item, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full max-w-4xl rounded-xl bg-neutral-900/40 p-4 sm:p-6 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {item.org}{" "}
                <span className="text-purple-300 font-normal">— {item.role}</span>
              </h3>
              <span className="text-sm text-neutral-400 mt-1 sm:mt-0">
                {item.duration}
              </span>
            </div>

            {/* Location */}
            <p className="italic text-sm text-neutral-400 mb-2">{item.location}</p>

            {/* Description */}
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Request Resume Button */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openChatbotWithResume'));
          }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Request Resume
        </button>
      </motion.div>
    </section>
  );
};

export default Leadership;
