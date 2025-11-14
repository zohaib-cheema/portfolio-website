import { SKILL_PLAYGROUNDS } from "../constants";
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

const SkillLabsPreview = () => {
  const highlights = SKILL_PLAYGROUNDS.slice(0, 3);

  return (
    <section
      id="skill-labs"
      className="border-b border-neutral-900 pb-20 pt-20 px-4 sm:px-8 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
          Skill Labs
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Market-Proof Demonstrations
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Snapshot of the hands-on labs that recruiters keep asking about—deep dives
          live on the Labs hub.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {highlights.map((lab, index) => (
          <motion.article
            key={lab.id}
            variants={fadeIn(index * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl bg-neutral-900/40 border border-neutral-800/60 p-5 flex flex-col gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                {lab.demandSignals.join(" • ")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{lab.title}</h3>
            </div>
            <p className="text-sm text-neutral-300 line-clamp-3">{lab.summary}</p>
            <ul className="text-xs text-neutral-400 space-y-1">
              {lab.highlights.slice(0, 2).map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="h-2 w-2 mt-1 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/labs"
          className="rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-6 py-3 text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          View full Labs hub →
        </Link>
      </div>
    </section>
  );
};

export default SkillLabsPreview;

