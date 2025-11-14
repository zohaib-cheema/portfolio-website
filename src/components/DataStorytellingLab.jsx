import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const cohortData = [
  {
    id: "genz",
    name: "GenZ Solopreneurs",
    persona: "Creators monetizing automation templates",
    signal: "Primary",
    experiments: {
      control: {
        activation: 0.62,
        retention: 0.41,
        expansion: 32000,
        ticketsPerK: 9,
        insights: [
          "Drop-off happens after the second failed workflow attempt.",
          "Video walkthrough consumption under-indexes at 14% completion.",
        ],
      },
      nudges: {
        activation: 0.69,
        retention: 0.5,
        expansion: 37800,
        ticketsPerK: 11,
        insights: [
          "Triggering a nudge after the 2nd failure adds +7 pts activation.",
          "Leaderboard-style messaging drives +18% expansion revenue.",
          "Slight ticket lift is acceptable within guardrail (<12 per 1K).",
        ],
      },
    },
  },
  {
    id: "collective",
    name: "Freelancer Collective",
    persona: "Boutique agencies sharing playbooks",
    signal: "Secondary",
    experiments: {
      control: {
        activation: 0.7,
        retention: 0.55,
        expansion: 28000,
        ticketsPerK: 14,
        insights: [
          "High activation but churn spikes when collaboration features break.",
        ],
      },
      nudges: {
        activation: 0.71,
        retention: 0.59,
        expansion: 30500,
        ticketsPerK: 19,
        insights: [
          "Nudges cut churn exits 5%, holding expansion gains at +9%.",
          "Need enablement content to offset support ticket spike.",
        ],
      },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise Trial",
    persona: "IT-led 90 day pilots",
    signal: "Guardrail",
    experiments: {
      control: {
        activation: 0.48,
        retention: 0.37,
        expansion: 52000,
        ticketsPerK: 6,
        insights: [
          "Value prop hinges on audit logs; nudges must stay disabled.",
        ],
      },
      nudges: {
        activation: 0.49,
        retention: 0.36,
        expansion: 52200,
        ticketsPerK: 6,
        insights: [
          "Experiment intentionally isolated—no significant movement (<1 pt).",
        ],
      },
    },
  },
];

const experimentOptions = [
  { id: "control", label: "Control" },
  { id: "nudges", label: "Personalized Nudges" },
];

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatPercent = (value) => percentFormatter.format(value);
const formatDollars = (value) => currencyFormatter.format(value);

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  },
});

const metricCards = [
  { key: "activation", label: "Activation", tooltip: "Signup → First value" },
  { key: "retention", label: "Week 4 Retention", tooltip: "Active users after 28 days" },
  { key: "expansion", label: "Expansion Revenue", tooltip: "Upsell & add-on revenue" },
];

const DataStorytellingLab = () => {
  const [selectedCohortId, setSelectedCohortId] = useState(cohortData[0].id);
  const [experimentId, setExperimentId] = useState("nudges");

  const selectedCohort = useMemo(
    () => cohortData.find((cohort) => cohort.id === selectedCohortId),
    [selectedCohortId]
  );

  const scenarioMetrics = selectedCohort.experiments[experimentId];
  const controlMetrics = selectedCohort.experiments.control;

  const deltas = useMemo(() => {
    if (experimentId === "control") return {};
    return {
      activation: scenarioMetrics.activation - controlMetrics.activation,
      retention: scenarioMetrics.retention - controlMetrics.retention,
      expansion: scenarioMetrics.expansion - controlMetrics.expansion,
    };
  }, [experimentId, scenarioMetrics, controlMetrics]);

  const chartBars = [
    {
      label: "Activation",
      base: controlMetrics.activation,
      variant: scenarioMetrics.activation,
      formatter: formatPercent,
    },
    {
      label: "Week 4 Retention",
      base: controlMetrics.retention,
      variant: scenarioMetrics.retention,
      formatter: formatPercent,
    },
    {
      label: "Expansion Revenue",
      base: controlMetrics.expansion / 1000,
      variant: scenarioMetrics.expansion / 1000,
      formatter: (value) => `$${value}K`,
    },
  ];

  return (
    <section
      id="data-storytelling-lab"
      className="border-b border-neutral-900 pb-24 pt-24 px-6 sm:px-10 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
          Data Storytelling Studio
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Cohort Explorer (Interactive Demo)
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Slice retention cohorts, compare experiment arms, and surface the narrative you would
          share with product, lifecycle, and leadership stakeholders.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={fadeIn(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/40 border border-neutral-800/60 p-6 sm:p-8"
        >
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-200">
                Cohort
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{selectedCohort.name}</h3>
              <p className="text-sm text-neutral-400">{selectedCohort.persona}</p>
            </div>
            <span className="px-3 py-1 rounded-full border border-purple-500/60 text-xs font-semibold text-purple-200">
              {selectedCohort.signal}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {cohortData.map((cohort) => (
              <button
                key={cohort.id}
                onClick={() => setSelectedCohortId(cohort.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  cohort.id === selectedCohortId
                    ? "border-purple-400 bg-purple-400/10 text-white"
                    : "border-neutral-700 text-neutral-300 hover:border-purple-300/60"
                }`}
              >
                {cohort.name}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {experimentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setExperimentId(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  option.id === experimentId
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {metricCards.map((card) => {
              const value = scenarioMetrics[card.key];
              const formattedValue =
                card.key === "expansion" ? formatDollars(value) : formatPercent(value);
              const deltaValue = deltas[card.key] ?? 0;
              const showDelta = experimentId !== "control" && card.key !== "ticketsPerK";

              return (
                <div
                  key={card.key}
                  className="rounded-2xl bg-neutral-800/50 border border-neutral-700/60 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formattedValue}</p>
                  {showDelta && (
                    <p
                      className={`text-sm font-semibold ${
                        deltaValue >= 0 ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {deltaValue >= 0 ? "+" : ""}
                      {card.key === "expansion" ? formatDollars(deltaValue) : formatPercent(deltaValue)}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-400">{card.tooltip}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
            {chartBars.map((bar) => {
              const baseWidth = Math.round(bar.base * 100);
              const variantWidth = Math.round(bar.variant * 100);
              const deltaWidth = variantWidth - baseWidth;

              return (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>{bar.label}</span>
                    <span>
                      {bar.formatter(bar.variant)}{" "}
                      {experimentId !== "control" && (
                        <span className={deltaWidth >= 0 ? "text-emerald-300" : "text-rose-300"}>
                          ({deltaWidth >= 0 ? "+" : ""}
                          {deltaWidth}
                          {bar.label === "Expansion Revenue" ? "" : "%"})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-800 overflow-hidden relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-neutral-700/60"
                      style={{ width: `${baseWidth}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500"
                      style={{ width: `${variantWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/45 border border-neutral-800/60 p-6 flex flex-col"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
            Narrative Builder
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Insights</h3>
          <p className="text-sm text-neutral-400">
            What you would tell the team in stand-up or a product review.
          </p>

          <ul className="mt-6 space-y-4 text-sm text-neutral-200">
            {scenarioMetrics.insights.map((insight) => (
              <li
                key={insight}
                className="flex gap-3 rounded-2xl bg-neutral-800/40 p-4 border border-neutral-800/70"
              >
                <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-sm text-neutral-300">
            <p className="font-semibold text-white">Guardrails</p>
            <p>
              Keep support tickets &lt; 12 per 1K users and retain Enterprise control isolation.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <a
              href="/artifacts/data-storytelling-decision-memo.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform duration-200"
            >
              Download Decision Memo →
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `Cohort: ${selectedCohort.name}\nExperiment: ${
                    experimentOptions.find((opt) => opt.id === experimentId)?.label
                  }\nActivation: ${percentFormatter.format(
                    scenarioMetrics.activation
                  )}\nWeek 4 Retention: ${percentFormatter.format(
                    scenarioMetrics.retention
                  )}\nExpansion: ${currencyFormatter.format(scenarioMetrics.expansion)}`
                );
              }}
              className="rounded-full border border-neutral-700 text-neutral-200 px-4 py-3 text-sm font-semibold hover:border-purple-300/60 transition-colors duration-200"
            >
              Copy snapshot to clipboard
            </button>
          </div>

          <p className="mt-4 text-xs text-neutral-500">
            Built with synthetic data; methodology mirrors real growth reviews.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DataStorytellingLab;

