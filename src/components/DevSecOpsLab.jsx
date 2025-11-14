import { useState } from "react";
import { motion } from "framer-motion";

const pipelineStages = [
  {
    id: "sbom",
    title: "SBOM Generation",
    tool: "CycloneDX + Syft",
    status: "clean",
    summary:
      "Every merge to main generates a CycloneDX SBOM plus SPDX manifest; artifacts are signed and uploaded for downstream policy gates.",
    checks: [
      "No CRITICAL vulnerabilities present",
      "Artifacts signed with cosign and stored in S3 bucket",
      "Dependency provenance recorded in attestations",
    ],
  },
  {
    id: "sast",
    title: "SAST + Secrets Scan",
    tool: "Semgrep + Gitleaks",
    status: "warning",
    summary:
      "Semgrep flagged a potential JWT misuse; secrets scanner stayed clean. Pipeline pauses for triage but allows override with approval.",
    checks: [
      "Semgrep rule `jwt-hardcoded-secret` triggered on `auth.service.ts`",
      "Gitleaks passed (0 findings)",
      "Requires security lead acknowledgement before continue",
    ],
  },
  {
    id: "dependency",
    title: "Dependency Scanning",
    tool: "Trivy + Dependabot",
    status: "critical",
    summary:
      "Trivy detected HIGH CVE on jsonwebtoken 9.0.2; Dependabot PR prepared. Rollout blocked until fix merged.",
    checks: [
      "GHSA-8hfj-j24r-96c4 severity HIGH",
      "Automatic Slack alert posted to #sec-ops",
      "Policy gate fails build until patched",
    ],
  },
  {
    id: "threat",
    title: "Threat Model & Incident Sim",
    tool: "Custom template + Chaos drill",
    status: "monitor",
    summary:
      "Interactive threat canvas tracks assets, attack vectors, and mitigations. Chaos drill simulates CVE intake and validates comms flow.",
    checks: [
      "Webhook SSRF mitigation still TODO → risk accepted",
      "Chaos drill 11/14: MTTD 5 min, MTTR 40 min",
      "RCA template auto-generated post drill",
    ],
  },
];

const sbomRows = [
  { component: "express", version: "4.18.2", license: "MIT", severity: "low", notes: "CVE-2024-37890 (docs route only)" },
  { component: "jsonwebtoken", version: "9.0.2", license: "MIT", severity: "high", notes: "GHSA-8hfj-j24r-96c4 → patch pending" },
  { component: "axios", version: "1.6.8", license: "MIT", severity: "none", notes: "Clean" },
  { component: "go-sql-driver/mysql", version: "1.7.1", license: "MPL-2.0", severity: "none", notes: "Clean" },
];

const threats = [
  {
    asset: "JWT session",
    threat: "Replay & stolen tokens",
    mitigation: "Rotate signing keys, enforce exp, pair with device fingerprint",
    status: "Mitigated",
  },
  {
    asset: "Checkout admin endpoint",
    threat: "Privilege escalation",
    mitigation: "RBAC + audit logging + anomaly alerts",
    status: "Mitigated",
  },
  {
    asset: "Webhook receiver",
    threat: "SSRF",
    mitigation: "Allow-list + outbound proxy + timeout",
    status: "Outstanding",
  },
];

const statusStyles = {
  clean: "text-emerald-300 bg-emerald-500/10 border border-emerald-400/40",
  warning: "text-amber-300 bg-amber-500/10 border border-amber-300/40",
  critical: "text-rose-300 bg-rose-500/10 border border-rose-300/40",
  monitor: "text-sky-300 bg-sky-500/10 border border-sky-300/40",
};

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const DevSecOpsLab = () => {
  const [stageId, setStageId] = useState("dependency");
  const selectedStage = pipelineStages.find((stage) => stage.id === stageId);

  return (
    <section
      id="devsecops-lab"
      className="border-b border-neutral-900 pb-24 pt-24 px-6 sm:px-10 md:px-16"
    >
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
          DevSecOps Lab
        </p>
        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Secure SDLC Control Room
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg">
          Follow a CI/CD pipeline that auto-generates SBOMs, runs SAST, blocks risky dependencies,
          and simulates CVE intake with chaos drills to prove supply-chain rigor.
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
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Pipeline Gates</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {pipelineStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setStageId(stage.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  stage.id === stageId
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {stage.title}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.3em]">
                Toolchain
              </p>
              <p className="text-2xl font-semibold text-white">{selectedStage.tool}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-semibold ${statusStyles[selectedStage.status]}`}>
              {selectedStage.status.toUpperCase()}
            </span>
          </div>

          <p className="mt-4 text-sm text-neutral-300">{selectedStage.summary}</p>

          <ul className="mt-4 space-y-3 text-sm text-neutral-200">
            {selectedStage.checks.map((check) => (
              <li
                key={check}
                className="flex gap-3 rounded-2xl bg-neutral-800/30 p-3 border border-neutral-800/60"
              >
                <span className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-neutral-900/45 border border-neutral-800/60 p-6 flex flex-col"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SBOM Highlight</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-separate border-spacing-y-2">
              <thead className="text-neutral-400">
                <tr>
                  <th className="pr-4">Component</th>
                  <th className="pr-4">Version</th>
                  <th className="pr-4">License</th>
                  <th className="pr-4">Severity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sbomRows.map((row) => (
                  <tr key={row.component} className="bg-neutral-900/60">
                    <td className="px-3 py-2 font-medium text-white">{row.component}</td>
                    <td className="px-3 py-2 text-neutral-200">{row.version}</td>
                    <td className="px-3 py-2 text-neutral-200">{row.license}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          row.severity === "high"
                            ? "bg-rose-500/20 text-rose-200"
                            : row.severity === "low"
                            ? "bg-amber-500/20 text-amber-200"
                            : "bg-emerald-500/20 text-emerald-200"
                        }`}
                      >
                        {row.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-neutral-300">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-400">Threat Model</p>
          <div className="mt-3 space-y-3">
            {threats.map((item) => (
              <div
                key={item.asset}
                className="rounded-2xl bg-neutral-800/30 border border-neutral-800/60 p-4"
              >
                <p className="text-sm font-semibold text-white">{item.asset}</p>
                <p className="text-xs text-neutral-400">Threat: {item.threat}</p>
                <p className="text-sm text-neutral-300 mt-2">{item.mitigation}</p>
                <span
                  className={`mt-3 inline-block px-3 py-1 rounded-full text-xs ${
                    item.status === "Mitigated"
                      ? "bg-emerald-500/20 text-emerald-200"
                      : "bg-amber-500/20 text-amber-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href="/artifacts/devsecops-lab-sbom.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform duration-200"
            >
              Download SBOM Packet →
            </a>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  `Stage: ${selectedStage.title} | Status: ${selectedStage.status}\nKey checks:\n- ${selectedStage.checks.join(
                    "\n- "
                  )}`
                )
              }
              className="rounded-full border border-neutral-700 text-neutral-200 px-4 py-3 text-sm font-semibold hover:border-purple-300/60 transition-colors duration-200"
            >
              Copy gate summary
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevSecOpsLab;

