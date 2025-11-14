import { motion } from "framer-motion";
import { SKILL_PLAYGROUNDS } from "../constants";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const SkillShowcases = () => {
  return (
    <section
      id="skill-labs"
      className="border-b border-neutral-900 pb-24 pt-28 px-6 sm:px-10 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
          Market Demand → Practical Proof
        </p>
        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Skill Labs
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        {SKILL_PLAYGROUNDS.map((playground, index) => (
          <motion.article
            key={playground.id}
            variants={fadeIn(index * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl bg-neutral-900/40 p-8 shadow-[0_0_25px_0_rgba(147,51,234,0.05)] hover:shadow-[0_0_25px_0_rgba(147,51,234,0.3)] transition-shadow duration-300 border border-neutral-800/60 flex flex-col"
          >
            <div className="flex flex-wrap items-start gap-3 justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  In demand
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {playground.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {playground.demandSignals.map((signal) => (
                  <span
                    key={signal}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/30 text-purple-200"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-neutral-300 text-sm sm:text-base leading-relaxed">
              {playground.summary}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-200">
              {playground.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              {playground.artifacts.map((artifact) => (
                <span
                  key={artifact}
                  className="px-3 py-1 rounded-full bg-neutral-800/80 text-xs font-medium text-neutral-200 border border-neutral-700/70"
                >
                  {artifact}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <a
                href={playground.ctaLink}
                target={playground.ctaLink.startsWith("#") ? undefined : "_blank"}
                rel={playground.ctaLink.startsWith("#") ? undefined : "noreferrer"}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform duration-200 w-full justify-center sm:w-auto"
              >
                {playground.ctaLabel} →
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default SkillShowcases;

