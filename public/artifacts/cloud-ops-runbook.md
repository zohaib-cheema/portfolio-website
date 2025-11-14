## Cloud Ops Command Center — Rollout & Incident Runbook

**Owner:** Zohaib Cheema  
**Services covered:** Checkout API, Notifications Worker, Cost Anomaly Detector  
**Last updated:** November 14, 2025

---

### 1. Deployment Guardrails
| Control | Description | Tooling |
|---------|-------------|---------|
| Feature Flags | Every customer-facing feature ships behind LaunchDarkly flags with auto-expire metadata. | LaunchDarkly + custom verifier |
| Progressive Delivery | Blue/green with 5%, 25%, 50%, 100% stages; automatic rollback if p95 latency > +15%. | Argo Rollouts |
| IaC Policy-as-Code | Terraform Cloud enforces budgets, tagging, and least-privileged IAM before apply. | Terraform + Sentinel |

---

### 2. Run of Show (Blue/Green)
1. **T-30 min**: Run `preflight.sh` → checks build, migrations, feature flag defaults.
2. **Canary 5%**: Monitor SLO dashboards (latency, error rate, saturation). Auto-rollback triggers if error budget burn > 2% in 10 mins.
3. **Shadow Traffic**: Mirror 10% of read requests to green environment, comparing response hashes.
4. **Ramp + Audit**: Increase to 25%, 50%, 100% only after approvals from SRE + product on-call.

---

### 3. Incident Playbook (Example: Checkout 502s)
1. **Detect**: Alert fires when 502s > 5% for 3 minutes.
2. **Stabilize**: Flip feature flags off, fail over to blue env, pause rollout pipeline.
3. **Diagnose**: Use CloudWatch + Grafana board; compare Terraform plan diff for drift.
4. **Communicate**:
   - Post to #incident-bridge Slack
   - Update status page template `statuspage_incident.md`
   - Assign scribe to capture timeline
5. **Resolve**: Patch issue (e.g., revert Nginx config), verify healthchecks, resume rollout.
6. **Review**: File RCA within 24h referencing template below.

---

### 4. RCA Template Snapshot
```
Summary:
Impact:
Detection time:
Mitigation time:
Root cause:
Corrective actions:
Preventive actions:
```

---

### 5. Cost Governance Cheatsheet
- **Daily budget diffs**: AWS Cost Explorer diffed against FinOps baseline.
- **Anomaly thresholds**: Any >8% daily delta triggers PagerDuty "FinOps-Sev2".
- **Tag compliance**: Terraform denies apply when `team`, `env`, `cost_center` missing.

---

### 6. Attachments
- `/src/components/CloudOpsLab.jsx` — Interactive console
- `/artifacts/cloud-ops-runbook.md` — this doc
- (Optional) `/public/assets/cloud-ops-dashboard.png` — synthetic Grafana board

