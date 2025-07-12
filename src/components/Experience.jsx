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
      className="border-b border-neutral-900 pb-24 pt-28 px-6 sm:px-10 md:px-16"
    >
      {/* Section Title */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
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
            className="w-full max-w-4xl rounded-xl bg-neutral-900/40 p-6 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300 flex flex-col gap-4"
          >
            {/* Top Row: Logo + Summary */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {experience.logo && (
                <div className="flex-shrink-0">
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    className="w-20 h-20 object-contain rounded-xl border border-neutral-800 bg-white p-2"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-neutral-400">{experience.year}</p>
                <h3 className="text-xl font-semibold text-white">
                  {experience.role}{" "}
                  <span className="text-purple-300 font-normal">
                    — {experience.company}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => toggleDropdown(index)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition-transform duration-200"
              >
                {expandedIndex === index ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Dropdown Details */}
            {expandedIndex === index && (
              <div className="mt-4 text-white border-t border-neutral-700 pt-4">
                <p className="text-neutral-300 whitespace-pre-wrap mb-4">
                  {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-900/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
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
    </section>
  );
};

export default Experience;
