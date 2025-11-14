import { motion } from "framer-motion";

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
  { name: "Go", icon: "go" },
  { name: "Python", icon: "python" },
  { name: "MySQL", icon: "mysql" },
  { name: "GitHub Actions", icon: "githubactions" },
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
        A looping snapshot of the tools I touch every week—from product design to
        distributed systems. Hover to pause, tap to explore.
      </motion.p>

      <motion.div
        variants={fadeIn(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative mt-12 overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-900/40 py-6"
      >
        <div className="logo-loop-fade-left" />
        <div className="logo-loop-fade-right" />
        <div className="logo-loop-track hover:[animation-play-state:paused]">
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
    </section>
  );
};

export default TechStack;

