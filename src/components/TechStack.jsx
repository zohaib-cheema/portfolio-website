import { motion } from "framer-motion";
import { useState } from "react";

// Technology name mapping for display
const techNameMap = {
  js: "JavaScript",
  ts: "TypeScript",
  vue: "Vue.js",
  angular: "Angular",
  react: "React",
  nextjs: "Next.js",
  flutter: "Flutter",
  html: "HTML",
  css: "CSS",
  sass: "Sass",
  tailwind: "Tailwind CSS",
  nodejs: "Node.js",
  express: "Express",
  mongodb: "MongoDB",
  firebase: "Firebase",
  flask: "Flask",
  kafka: "Kafka",
  jest: "Jest",
  postman: "Postman",
  git: "Git",
  figma: "Figma",
  idea: "IntelliJ IDEA",
  vscode: "VS Code",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  aws: "AWS",
  gcp: "Google Cloud",
  azure: "Azure",
  docker: "Docker",
  supabase: "Supabase",
  vercel: "Vercel",
  netlify: "Netlify",
  cypress: "Cypress",
  githubactions: "GitHub Actions",
  bash: "Bash",
  linux: "Linux",
  gradle: "Gradle",
  vim: "Vim",
  emacs: "Emacs",
  python: "Python",
  go: "Go",
  java: "Java",
  c: "C",
};

// Technology categories
const techCategories = [
  {
    title: "Languages",
    technologies: ["python", "go", "java", "c"],
  },
  {
    title: "Frontend",
    technologies: ["js", "ts", "vue", "angular", "react", "nextjs", "flutter", "html", "css", "sass", "tailwind"],
  },
  {
    title: "Backend & Tools",
    technologies: ["nodejs", "express", "mongodb", "firebase", "flask", "kafka", "jest", "postman", "git", "figma", "idea", "vscode"],
  },
  {
    title: "Databases / Auth / Hosting",
    technologies: ["postgres", "mysql", "aws", "gcp", "azure", "docker", "supabase", "vercel", "netlify"],
  },
  {
    title: "Testing / Dev",
    technologies: ["cypress", "githubactions", "bash", "linux", "gradle", "vim", "emacs"],
  },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const marqueeTechs = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "ts" },
  { name: "Node.js", icon: "nodejs" },
  { name: "PostgreSQL", icon: "postgres" },
  { name: "AWS", icon: "aws" },
  { name: "Docker", icon: "docker" },
  { name: "TensorFlow", icon: "tensorflow" },
  { name: "Figma", icon: "figma" },
  { name: "Kafka", icon: "kafka" },
];

const TechStack = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const MAX_VISIBLE_TECHS = 5;

  const toggleCategory = (categoryTitle) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  return (
    <section
      id="tech-stack"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      {/* Main Section Title */}
      <motion.h2
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-10 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Tech Stack
      </motion.h2>

      {/* Logo loop */}
      <motion.div
        variants={fadeIn(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-900/40 py-6"
      >
        <div className="logo-loop-fade-left" />
        <div className="logo-loop-fade-right" />
        <div className="logo-loop-track">
          {[...Array(2)].map((_, loopIndex) =>
            marqueeTechs.map((tech) => (
              <div
                key={`${tech.name}-${loopIndex}`}
                className="flex w-40 flex-col items-center justify-center gap-2 px-4"
              >
                <img
                  src={`https://skillicons.dev/icons?i=${tech.icon}&theme=dark`}
                  alt={tech.name}
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
                <span className="text-sm font-medium text-neutral-200">{tech.name}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-6 mt-16 max-w-6xl mx-auto">
        {techCategories.map((category, categoryIndex) => {
          const isExpanded = expandedCategories[category.title];
          const visibleTechs = isExpanded
            ? category.technologies
            : category.technologies.slice(0, MAX_VISIBLE_TECHS);
          const hasMore = category.technologies.length > MAX_VISIBLE_TECHS;

          return (
            <motion.div
              key={category.title}
              variants={fadeIn(categoryIndex * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full rounded-xl bg-neutral-900/40 p-6 sm:p-8 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300"
            >
              {/* Category Title */}
              <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 mb-6 text-center">
                {category.title}
              </h3>

              {/* Tech Grid */}
              <div className={`grid gap-4 ${
                category.title === "Languages" 
                  ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 max-w-2xl mx-auto"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              }`}>
                {visibleTechs.map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    variants={fadeIn(categoryIndex * 0.1 + techIndex * 0.05)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center rounded-lg bg-neutral-800/40 p-3 sm:p-4 hover:bg-neutral-800/60 transition-colors duration-200 w-full"
                  >
                    {/* Icon */}
                    <img
                      src={`https://skillicons.dev/icons?i=${tech}&theme=dark`}
                      alt={techNameMap[tech] || tech}
                      className="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if icon fails to load
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Name */}
                    <span className="text-xs sm:text-sm text-neutral-300 text-center font-medium">
                      {techNameMap[tech] || tech}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* See More/Less Button */}
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 text-white text-sm font-medium shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    {isExpanded ? "See Less" : "See More"}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TechStack;

