import { PROJECTS } from "../constants";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const Projects = () => {
  // Show only the first 3 projects
  const displayedProjects = PROJECTS.slice(0, 3);

  return (
    <div className="border-b border-neutral-900 pb-24 px-4">
      {/* Heading */}
      <motion.h2
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-20 text-center text-4xl font-bold"
      >
        Projects
      </motion.h2>

      {/* Project Grid */}
      <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3 place-items-center">
        {displayedProjects.map((project, index) => (
          <motion.div
            key={index}
            variants={fadeIn(index * 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full max-w-sm rounded-xl bg-neutral-900/40 backdrop-blur-md p-5 shadow-md hover:shadow-purple-800 transition-shadow duration-300"
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
            <div className="flex flex-wrap gap-2">
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
      </div>

      {/* View All Projects Button */}
      <div className="mt-16 flex justify-center">
        <a
          href="https://github.com/zohaib-cheema?tab=repositories" // <-- Replace with your GitHub URL
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-purple-700 px-6 py-3 text-white text-sm font-semibold hover:bg-purple-800 transition-colors duration-300 shadow-md"
        >
          View All Projects →
        </a>
      </div>
    </div>
  );
};

export default Projects;