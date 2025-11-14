import { motion } from "framer-motion";
import { ARTIFACT_LIBRARY } from "../constants";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  },
});

const ArtifactLibrary = () => {
  return (
    <section
      id="artifact-library"
      className="border-b border-neutral-900 pb-24 pt-24 px-6 sm:px-10 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Proof over buzzwords
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Artifact Library
        </h2>
        <p className="mt-5 text-neutral-300 text-base sm:text-lg">
          Recruiters can download or preview the exact artifacts that verify
          your skills—logs, runbooks, audits, and enablement kits that translate
          directly to day-one impact.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {ARTIFACT_LIBRARY.map((artifact, index) => (
          <motion.div
            key={artifact.title}
            variants={fadeIn(0.1 + index * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl bg-neutral-900/35 border border-neutral-800/70 p-6 flex flex-col shadow-[0_0_25px_0_rgba(15,23,42,0.4)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold text-white">
                {artifact.title}
              </h3>
              <span className="text-xs uppercase tracking-[0.3em] text-purple-200">
                {artifact.format}
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              {artifact.goal}
            </p>
            <p className="mt-3 text-sm text-purple-200">
              Impact: {artifact.impact}
            </p>

            <div className="mt-6">
              <a
                href={artifact.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center rounded-full border border-purple-300/60 px-4 py-2 text-sm font-semibold text-purple-100 hover:bg-purple-500/10 transition-colors duration-200"
              >
                {artifact.linkLabel} →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ArtifactLibrary;

