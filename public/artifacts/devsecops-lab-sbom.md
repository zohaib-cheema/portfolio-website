## DevSecOps Lab — SBOM & Incident Simulation Packet

**Owner:** Zohaib Cheema  
**Scope:** Checkout API service (Node.js + Go workers)  
**Generated:** November 14, 2025

---

### 1. SBOM Snapshot (CycloneDX v1.5)
| Component | Version | License | Vuls |
|-----------|---------|---------|------|
| express | 4.18.2 | MIT | CVE-2024-37890 (low) |
| axios | 1.6.8 | MIT | none |
| jsonwebtoken | 9.0.2 | MIT | GHSA-8hfj-j24r-96c4 (medium) |
| go-sql-driver/mysql | 1.7.1 | MPL-2.0 | none |

Actions:
- Raised Dependabot PR #542 to bump `jsonwebtoken`.
- Suppressed express CVE with justification: not exposed (docs route only).

---

### 2. CI/CD Gate Summary
1. **SBOM Generation** — `npm run sbom && cyclonedx-bom -o sbom.json`
2. **SAST** — `semgrep ci` with ruleset `p/owasp-top-ten`
3. **Dependency Scan** — `trivy fs . --exit-code 1 --severity HIGH,CRITICAL`
4. **Policy Gate** — GitHub Actions job `policy-check` ensures:
   - SBOM uploaded to artifact store
   - No CRITICAL vulns open
   - Secrets scan clean

---

### 3. Threat Model (Checkout API)
| Asset | Threat | Control | Status |
|-------|--------|---------|--------|
| JWT session | Token replay | Rotate signing keys, enforce exp | In place |
| Admin endpoint | Privilege escalation | RBAC + audit logging | In place |
| Webhook receiver | SSRF | Allow-list domains + timeouts | TODO |

---

### 4. Incident Simulation — CVE Intake
**Scenario:** GitHub advisory issues HIGH CVE for `jsonwebtoken`.
- **T+0 min:** Dependabot alert triaged.
- **T+5 min:** `policy-check` fails pipeline; Slack alert via webhook.
- **T+25 min:** Patch merged, SBOM regenerated, artifacts signed.
- **T+40 min:** Security lead approves, rollout resumes with blue/green.
- **T+60 min:** Post-incident checklist completed (RCA in `/rca/2025-11-14.md`).

---

### 5. Attachments
- `/src/components/DevSecOpsLab.jsx` — Interactive lab UI
- `/artifacts/devsecops-lab-sbom.md` — this packet
- Future work: upload threat model diagram PNG

