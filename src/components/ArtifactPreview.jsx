import { ARTIFACT_LIBRARY } from "../constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const ArtifactPreview = () => {
  const artifacts = ARTIFACT_LIBRARY.slice(0, 4);

  return (
    <section
      id="artifact-library"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
          Artifact Library
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Proof You Can Share
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Quick peek at the downloadable evidence—runbooks, audits, toolkits.
          Grab the full library on the dedicated page.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {artifacts.map((artifact, index) => (
          <motion.div
            key={artifact.title}
            variants={fadeIn(index * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl bg-neutral-900/40 border border-neutral-800/60 p-5 flex flex-col gap-3"
          >
            <h3 className="text-xl font-semibold text-white">{artifact.title}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              {artifact.format}
            </p>
            <p className="text-sm text-neutral-300 line-clamp-3">{artifact.goal}</p>
            <p className="text-xs text-purple-200">{artifact.impact}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/artifacts"
          className="rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-6 py-3 text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Browse all artifacts →
        </Link>
      </div>
    </section>
  );
};

export default ArtifactPreview;

