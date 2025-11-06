import { motion } from "framer-motion";

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
  {
    title: "Languages",
    technologies: ["python", "go", "java", "c"],
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

const TechStack = () => {
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

      {/* Categories */}
      <div className="space-y-12 mt-16">
        {techCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            variants={fadeIn(categoryIndex * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            {/* Category Title */}
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 mb-6 text-center">
              {category.title}
            </h3>

            {/* Tech Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.technologies.map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  variants={fadeIn(categoryIndex * 0.1 + techIndex * 0.05)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center rounded-xl bg-neutral-900/40 p-4 shadow-[0_0_15px_3px_rgba(192,132,252,0.0)] hover:shadow-[0_0_15px_3px_rgba(192,132,252,0.6)] transition-shadow duration-300"
                >
                  {/* Icon */}
                  <img
                    src={`https://skillicons.dev/icons?i=${tech}&theme=dark`}
                    alt={techNameMap[tech] || tech}
                    className="w-12 h-12 sm:w-14 sm:h-14 mb-2 object-contain"
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;

