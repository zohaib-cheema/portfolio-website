import { useState } from "react";
import { motion } from "framer-motion";

const personas = [
  {
    id: "low-vision",
    name: "Low-Vision Creator",
    quote: "“The gradient CTA is pretty but unreadable on hover.”",
    needs: ["High contrast", "Persistent accessibility toggles", "Clear focus outlines"],
    changes: [
      "Darkened gradient stops (4.8:1) + outline on hover",
      "Added contrast toggle stored in localStorage",
      "Expanded button hit areas to 44px minimum",
    ],
  },
  {
    id: "screen-reader",
    name: "Screen-Reader Power User",
    quote: "“Let me jump past the particle hero and straight to the content.”",
    needs: ["Skip links", "Semantic headings", "Descriptive ARIA labels"],
    changes: [
      "Added `Skip to content` + `Skip to contact` anchors",
      "Normalized heading order (H1 → H2) for sections",
      "Newsletter form now uses labels + aria-describedby helper text",
    ],
  },
  {
    id: "neurodivergent",
    name: "Neurodivergent Student",
    quote: "“Animations are distracting when I’m trying to read.”",
    needs: ["Motion controls", "Focus mode", "Concise copy"],
    changes: [
      "Respects `prefers-reduced-motion` and exposes manual toggle",
      "Focus mode hides background particles and dims colors",
      "Split hero copy into shorter sentences for scannability",
    ],
  },
];

const auditChecks = [
  { label: "WCAG Coverage", value: "94%", status: "Pass" },
  { label: "Contrast Avg", value: "4.8:1", status: "Pass" },
  { label: "Keyboard Flows", value: "22 / 24", status: "Needs work" },
  { label: "Screen Reader Time", value: "2m 15s", status: "Improved" },
];

const findings = [
  {
    id: "A11Y-001",
    category: "Contrast",
    severity: "High",
    summary: "Gradient CTA text dips below 4.5:1 on hover.",
    fix: "Darken gradient stop + add outline/focus styles.",
  },
  {
    id: "A11Y-002",
    category: "Forms",
    severity: "Medium",
    summary: "Newsletter uses placeholder-only labels.",
    fix: "Add `<label>` + helper text, map aria-describedby.",
  },
  {
    id: "A11Y-003",
    category: "Motion",
    severity: "Medium",
    summary: "Particles animate even when OS reduces motion.",
    fix: "Respect `prefers-reduced-motion` + add toggle.",
  },
  {
    id: "A11Y-004",
    category: "Keyboard",
    severity: "Medium",
    summary: "Modal close button skipped in tab order.",
    fix: "Implement focus trap + `tabIndex=0` on close control.",
  },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const InclusiveDesignLab = () => {
  const [personaId, setPersonaId] = useState(personas[0].id);
  const activePersona = personas.find((persona) => persona.id === personaId);

  return (
    <section
      id="inclusive-design-lab"
      className="border-b border-neutral-900 pb-24 pt-24 px-6 sm:px-10 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Inclusive Design Playground
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Accessibility QA Liveboard
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Explore the audit scores, user personas, and remediation steps behind the portfolio’s accessibility improvements.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={fadeIn(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/40 border border-neutral-800/60 p-6"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Personas</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setPersonaId(persona.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  persona.id === personaId
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {persona.name}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-neutral-900/70 border border-neutral-800/60 p-5">
            <p className="text-sm text-neutral-400">{activePersona.quote}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Needs
            </p>
            <ul className="mt-2 space-y-2 text-sm text-neutral-200">
              {activePersona.needs.map((need) => (
                <li key={need} className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                  <span>{need}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Changes Delivered
            </p>
            <ul className="mt-2 space-y-2 text-sm text-neutral-200">
              {activePersona.changes.map((change) => (
                <li key={change} className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-emerald-400 via-slate-400 to-blue-500" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {auditChecks.map((check, idx) => (
              <div
                key={check.label}
                className="rounded-2xl bg-neutral-800/40 border border-neutral-700/60 p-4"
              >
                <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">
                  {check.label}
                </p>
                <p className="text-2xl font-semibold text-white mt-2">{check.value}</p>
                <p className="text-xs text-purple-200 mt-1">{check.status}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/45 border border-neutral-800/60 p-6 flex flex-col"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top Findings</p>
          <div className="mt-4 space-y-4">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className="rounded-2xl bg-neutral-800/30 border border-neutral-800/60 p-4"
              >
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{finding.id} • {finding.category}</span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      finding.severity === "High"
                        ? "bg-rose-500/20 text-rose-200"
                        : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {finding.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-200">{finding.summary}</p>
                <p className="mt-2 text-xs text-emerald-200">Fix: {finding.fix}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href="/artifacts/inclusive-qa-report.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform duration-200"
            >
              Download QA Report →
            </a>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  `Accessibility highlights:\n- WCAG coverage 94%\n- Contrast avg 4.8:1\n- Keyboard flows 22/24\n- Screen reader time 2m15s`
                )
              }
              className="rounded-full border border-neutral-700 text-neutral-200 px-4 py-3 text-sm font-semibold hover:border-purple-300/60 transition-colors duration-200"
            >
              Copy summary
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InclusiveDesignLab;

