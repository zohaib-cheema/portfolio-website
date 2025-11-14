import { motion } from "framer-motion";

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

const TechStack = () => {
  return (
    <section
      id="tech-stack"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      <motion.h2
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-10 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent"
      >
        Tech Stack
      </motion.h2>

      <motion.p
        variants={fadeIn(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center text-neutral-300 text-base sm:text-lg"
      >
        Each lane loops through the tools I use most for that layer of the stack—hover
        to pause, click to preview icons.
      </motion.p>

      <div className="mt-12 space-y-10">
        {techCategories.map((category, index) => (
          <motion.div
            key={category.title}
            variants={fadeIn(0.1 + index * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-2xl font-semibold text-purple-300">
                {category.title}
              </h3>
              <p className="text-sm text-neutral-400">
                {category.technologies.length} core tools
              </p>
            </div>
            <div className="relative overflow-hidden py-4">
              <div className="logo-loop-fade-left" />
              <div className="logo-loop-fade-right" />
              <div className="logo-loop-track hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, loopIndex) =>
                  category.technologies.map((tech) => (
                    <div
                      key={`${category.title}-${tech}-${loopIndex}`}
                      className="flex w-36 flex-col items-center justify-center gap-2 px-4"
                    >
                      <img
                        src={`https://skillicons.dev/icons?i=${tech}&theme=dark`}
                        alt={techNameMap[tech] || tech}
                        className="h-10 w-10 object-contain"
                        loading="lazy"
                      />
                      <span className="text-xs font-medium text-neutral-200">
                        {techNameMap[tech] || tech}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;

