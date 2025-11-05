import { motion } from "framer-motion";
import { PROJECTS } from "../constants";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Projects = () => {
  const displayedProjects = PROJECTS.slice(0, 3);

  return (
    <section
      id="projects"
      className="border-b border-neutral-900 pb-24 pt-28 px-6 sm:px-10 md:px-16"
    >
      {/* Gradient Title */}
      <motion.h2
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-10 pb-1 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Projects
      </motion.h2>

      {/* Project Grid */}
      <motion.div
        variants={fadeIn(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-12 md:grid-cols-2 xl:grid-cols-3 place-items-stretch"
      >
        {displayedProjects.map((project, index) => (
          <motion.div
            key={index}
            variants={fadeIn(index * 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full max-w-sm h-full flex flex-col justify-between rounded-xl bg-neutral-900/40 p-5 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300"
          >
            {/* Project Image */}
            <div className="overflow-hidden rounded-lg mb-4">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-neutral-300 text-sm mb-4">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-purple-900/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Projects Button */}
      <motion.div
        variants={fadeIn(0.4)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 flex justify-center"
      >
        <a
          href="https://github.com/zohaib-cheema"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-6 py-3 text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          View All Projects →
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
