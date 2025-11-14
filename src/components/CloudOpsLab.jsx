import { useState } from "react";
import { motion } from "framer-motion";

const deployments = [
  {
    id: "checkout",
    service: "Checkout API",
    stage: "Canary 25%",
    health: "warning",
    notes: "Error budget burn at 1.4% — keep watching before 50% ramp.",
    metrics: {
      latencyP95: 410,
      errorRate: 0.012,
      saturation: 0.61,
      costDelta: 0.05,
    },
    flags: ["ld:checkout-smarter-routing", "ld:checkout-logging-v2"],
    drift: [
      "+ module.nginx.aws_lb_listener_rule.checkout canary path updated",
      "~ module.checkout_redis.aws_elasticache_cluster.nodes (size: cache.t3.medium → cache.t3.large)",
    ],
    playbookSteps: [
      "Hold ramp at 25%, validate redis CPU after size bump.",
      "If error rate >1.5% for 5 min, flip ld:checkout-smarter-routing off.",
    ],
  },
  {
    id: "notifications",
    service: "Notifications Worker",
    stage: "Green 100%",
    health: "healthy",
    notes: "Rollout completed; monitoring for 30 minutes before closing.",
    metrics: {
      latencyP95: 220,
      errorRate: 0.003,
      saturation: 0.35,
      costDelta: -0.02,
    },
    flags: ["ld:notif-batch-v3"],
    drift: [],
    playbookSteps: [
      "Verify SQS queue length stays < 5k.",
      "Tag release in Change Calendar once observation window passes.",
    ],
  },
  {
    id: "cost-guard",
    service: "Cost Anomaly Detector",
    stage: "Blue 50%",
    health: "critical",
    notes: "FinOps alert fired: daily spend +9%. Terraform plan pending approval.",
    metrics: {
      latencyP95: 510,
      errorRate: 0.02,
      saturation: 0.72,
      costDelta: 0.09,
    },
    flags: ["ld:cost-guard-finops"],
    drift: [
      "- module.cost_guard.aws_lambda_function.enrich (deleted inadvertently)",
      "+ module.cost_guard.aws_lambda_function.enrich_v2 (missing tags team, cost_center)",
    ],
    playbookSteps: [
      "Freeze rollout, revert to previous Lambda version.",
      "Run terraform plan with Sentinel policy fix before reapply.",
      "Post update to #finops-ops and finance stakeholder.",
    ],
  },
];

const healthStyles = {
  healthy: "text-emerald-300 bg-emerald-500/10 border border-emerald-400/40",
  warning: "text-amber-300 bg-amber-500/10 border border-amber-300/40",
  critical: "text-rose-300 bg-rose-500/10 border border-rose-300/40",
};

const metricCards = [
  { key: "latencyP95", label: "Latency P95", unit: "ms", threshold: 450 },
  { key: "errorRate", label: "Error Rate", unit: "%", threshold: 0.015 },
  { key: "saturation", label: "Saturation", unit: "%", threshold: 0.75 },
  { key: "costDelta", label: "Cost Delta", unit: "%", threshold: 0.08 },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  },
});

const CloudOpsLab = () => {
  const [selectedDeploymentId, setSelectedDeploymentId] = useState(deployments[0].id);
  const selectedDeployment = deployments.find((d) => d.id === selectedDeploymentId);

  return (
    <section
      id="cloud-ops-lab"
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
          Cloud Ops Command Center
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Blue/Green Rollout Console
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Monitor synthetic services as they progress through feature-flagged rollouts,
          inspect Terraform drift, and follow runbook guidance just like a real on-call rotation.
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
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Deployments</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {deployments.map((deployment) => (
              <button
                key={deployment.id}
                onClick={() => setSelectedDeploymentId(deployment.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  deployment.id === selectedDeploymentId
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {deployment.service}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.3em]">
                Stage
              </p>
              <p className="text-2xl font-semibold text-white">{selectedDeployment.stage}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-semibold ${healthStyles[selectedDeployment.health]}`}>
              {selectedDeployment.health.toUpperCase()}
            </span>
          </div>

          <p className="mt-4 text-sm text-neutral-300">{selectedDeployment.notes}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {metricCards.map((card) => {
              const rawValue = selectedDeployment.metrics[card.key];
              const displayValue =
                card.key === "errorRate" || card.key === "saturation" || card.key === "costDelta"
                  ? `${(rawValue * 100).toFixed(1)}${card.unit}`
                  : `${rawValue}${card.unit}`;
              const exceeds =
                card.key === "latencyP95"
                  ? rawValue > card.threshold
                  : rawValue > card.threshold;

              return (
                <div
                  key={card.key}
                  className={`rounded-2xl p-4 border ${
                    exceeds ? "border-rose-400/50 bg-rose-500/5" : "border-neutral-700/60 bg-neutral-800/40"
                  }`}
                >
                  <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{displayValue}</p>
                  {exceeds && (
                    <p className="text-xs text-rose-300 mt-1">Above threshold</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Feature Flags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedDeployment.flags.map((flag) => (
                <span
                  key={flag}
                  className="px-3 py-1 text-xs rounded-full bg-neutral-800/60 border border-neutral-700 text-neutral-200"
                >
                  {flag}
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
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Terraform Diff</p>
          <div className="mt-3 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 p-4 text-xs text-neutral-200 space-y-2">
            {selectedDeployment.drift.length === 0 ? (
              <p className="text-neutral-500">No drift detected.</p>
            ) : (
              selectedDeployment.drift.map((line) => (
                <p key={line}>
                  {line.startsWith("+") ? (
                    <span className="text-emerald-300">{line}</span>
                  ) : line.startsWith("~") ? (
                    <span className="text-amber-300">{line}</span>
                  ) : (
                    <span className="text-rose-300">{line}</span>
                  )}
                </p>
              ))
            )}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-400">Runbook</p>
          <ul className="mt-3 space-y-3 text-sm text-neutral-200">
            {selectedDeployment.playbookSteps.map((step) => (
              <li
                key={step}
                className="flex gap-3 rounded-2xl bg-neutral-800/30 p-3 border border-neutral-800/60"
              >
                <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3">
            <a
              href="/artifacts/cloud-ops-runbook.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform duration-200"
            >
              Download Runbook →
            </a>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  `${selectedDeployment.service} | Stage: ${selectedDeployment.stage} | Health: ${selectedDeployment.health}\n` +
                    `Latency p95: ${selectedDeployment.metrics.latencyP95}ms | Error rate: ${(selectedDeployment.metrics.errorRate * 100).toFixed(
                      2
                    )}%`
                )
              }
              className="rounded-full border border-neutral-700 text-neutral-200 px-4 py-3 text-sm font-semibold hover:border-purple-300/60 transition-colors duration-200"
            >
              Copy status snapshot
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CloudOpsLab;

