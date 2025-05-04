import { EXPERIENCES } from "../constants";
import { motion } from "framer-motion";

const Experience = () => {
  return (
    <div className="border-b border-neutral-900 pb-4 px-4">
      {/* Section Title */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-bold"
      >
        Work <span className="text-neutral-500">Experience</span>
      </motion.h2>

      {/* Experience Cards */}
      <div className="flex flex-col items-center space-y-10">
        {EXPERIENCES.map((experience, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full max-w-4xl rounded-xl bg-neutral-900/40 p-6 shadow-md hover:shadow-purple-800 transition-shadow duration-300"
          >
            {/* Logo + Heading */}
            <div className="flex items-center gap-4 mb-2">
              {experience.logo && (
                <img
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  className="w-10 h-10 object-cover rounded-full"
                />
              )}
              <div>
                <p className="text-sm text-neutral-400">{experience.year}</p>
                <h3 className="text-xl font-semibold text-white">
                  {experience.role}{" "}
                  <span className="text-purple-300 font-normal">
                    — {experience.company}
                  </span>
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-300 mb-4">{experience.description}</p>

            {/* Tech Stack */}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
