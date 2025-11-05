import { motion } from "framer-motion";
import { useState } from "react";
import { EXPERIENCES } from "../constants";

const Experience = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDropdown = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="experience"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      {/* Section Title */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Work Experience
      </motion.h2>

      {/* Experience Cards */}
      <div className="flex flex-col items-center space-y-10">
        {EXPERIENCES.map((experience, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full max-w-4xl rounded-xl bg-neutral-900/40 p-4 sm:p-6 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300 flex flex-col gap-4"
          >
            {/* Top Row: Logo + Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {experience.logo && (
                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border border-neutral-800 bg-white p-2"
                  />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base text-neutral-400">
                  {experience.year}
                </p>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {experience.role}{" "}
                  <span className="text-purple-300 font-normal">
                    — {experience.company}
                  </span>
                </h3>
              </div>
              <div className="flex justify-center sm:justify-end">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 text-white text-sm sm:text-base font-medium shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  {expandedIndex === index ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>

            {/* Dropdown Details */}
            {expandedIndex === index && (
              <div className="mt-4 text-white border-t border-neutral-700 pt-4">
                <p className="text-sm sm:text-base text-neutral-300 whitespace-pre-wrap mb-4">
                  {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-900/20 text-purple-300 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

export default Experience;
