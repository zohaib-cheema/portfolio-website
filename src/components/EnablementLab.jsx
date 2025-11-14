import { motion } from "framer-motion";
import { useState } from "react";

const workshops = [
  {
    id: "genai",
    title: "GenAI Builder Lab",
    duration: "90 min",
    outcome: "Planner/builder workflow with eval guardrails shipped by each squad.",
    agenda: [
      "Icebreaker + use-case framing",
      "Walkthrough of multi-agent architecture",
      "Hands-on build with starter repo",
      "Telemetry + guardrail retro",
    ],
    resources: ["Slides deck", "Starter repo", "Eval checklist"],
  },
  {
    id: "cloudops",
    title: "Cloud Ops Simulator",
    duration: "75 min",
    outcome: "Team executes blue/green rollout, catches drift, files RCA.",
    agenda: [
      "Incident brief + tool onboarding",
      "Rollout simulation (Argo + Grafana)",
      "RCA writing sprint",
      "Stakeholder readout practice",
    ],
    resources: ["Incident brief template", "Grafana screenshot pack", "RCA template"],
  },
  {
    id: "inclusive",
    title: "Inclusive Design Sprint",
    duration: "60 min",
    outcome: "Participants run heuristic review and ship motion/contrast fixes.",
    agenda: [
      "Persona lightning talk",
      "Heuristic review pairs",
      "Contrast + motion fixes",
      "Accessibility regression plan",
    ],
    resources: ["Persona cards", "Figma checklist", "Regression script"],
  },
];

const metrics = [
  { label: "Attendees", value: "214", description: "Across 6 campuses & meetups" },
  { label: "Confidence Lift", value: "+92%", description: "Pre/post GenAI skills survey" },
  { label: "Follow-up Commits", value: "38", description: "Teams continued building after labs" },
  { label: "NPS", value: "72", description: "Average workshop rating" },
];

const testimonials = [
  {
    quote: "“The Cloud Ops simulator felt like a real on-call rotation—our club now runs it monthly.”",
    author: "Priya, SWE Club Lead",
  },
  {
    quote: "“Having facilitation scripts + templates let me deliver an AI lab in under a week.”",
    author: "Mateo, Bootcamp Instructor",
  },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  },
});

const EnablementLab = () => {
  const [activeWorkshopId, setActiveWorkshopId] = useState(workshops[0].id);
  const activeWorkshop = workshops.find((workshop) => workshop.id === activeWorkshopId);

  return (
    <section
      id="enablement-lab"
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
          Enablement Hub
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Workshop Toolkit
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Browse the facilitation kit I use to teach GenAI, Cloud Ops, and Inclusive Design—
          complete with agendas, assets, and impact metrics.
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
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Workshops</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {workshops.map((workshop) => (
              <button
                key={workshop.id}
                onClick={() => setActiveWorkshopId(workshop.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  workshop.id === activeWorkshopId
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {workshop.title}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-neutral-900/70 border border-neutral-800/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-[0.3em]">
                  Duration
                </p>
                <p className="text-2xl font-semibold text-white">{activeWorkshop.duration}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-200 border border-neutral-700">
                Outcome
              </span>
            </div>
            <p className="mt-3 text-sm text-neutral-300">{activeWorkshop.outcome}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Agenda
            </p>
            <ul className="mt-2 space-y-2 text-sm text-neutral-200">
              {activeWorkshop.agenda.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
              Resources
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeWorkshop.resources.map((resource) => (
                <span
                  key={resource}
                  className="px-3 py-1 text-xs rounded-full bg-neutral-800/60 border border-neutral-700 text-neutral-200"
                >
                  {resource}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/45 border border-neutral-800/60 p-6 flex flex-col"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Impact</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl bg-neutral-800/30 border border-neutral-800/60 p-4"
              >
                <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">
                  {metric.label}
                </p>
                <p className="text-2xl font-semibold text-white mt-2">{metric.value}</p>
                <p className="text-xs text-neutral-400 mt-1">{metric.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</p>
          <div className="mt-3 space-y-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.quote}
                className="rounded-2xl bg-neutral-800/30 border border-neutral-800/60 p-4 text-sm text-neutral-200"
              >
                <p className="italic">“{testimonial.quote}”</p>
                <p className="mt-2 text-xs text-neutral-400">— {testimonial.author}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href="/artifacts/enablement-toolkit.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform duration-200"
            >
              Download Toolkit →
            </a>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  `Enablement toolkit stats:\n- Attendees: 214\n- Confidence lift: +92%\n- Follow-up commits: 38\n- Workshops: ${workshops
                    .map((w) => w.title)
                    .join(", ")}`
                )
              }
              className="rounded-full border border-neutral-700 text-neutral-200 px-4 py-3 text-sm font-semibold hover:border-purple-300/60 transition-colors duration-200"
            >
              Copy facilitator summary
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnablementLab;

