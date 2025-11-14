## Data Storytelling Studio Decision Memo

**Prepared by:** Zohaib Cheema  
**Last updated:** November 14, 2025  
**Source:** Synthetic product analytics warehouse (`fct_sessions`, `dim_experiments`, `dim_segments`)

---

### 1. Objective
Validate whether the *Personalized Nudges* experiment improves Week 4 retention for GenZ Solopreneurs without harming activation or monetization for other cohorts.

---

### 2. Key Findings
1. **GenZ Solopreneurs (primary cohort)**
   - Activation +7 pts (62% → 69%) after nudges
   - Week 4 retention +9 pts (41% → 50%)
   - Expansion revenue +18% ($32K → $37.8K) driven by add-on purchase bundles
2. **Freelancer Collective (secondary cohort)**
   - Activation flat (70% → 71%) but churn exits reduced 5%
   - Negative signal: Support tickets per 1K users rose from 14 → 19, requiring enablement content
3. **Enterprise Trial (guardrail)**
   - No material impact (<1 pt movement), confirming experiment isolation

---

### 3. Insights
- Personalized nudges are most effective when triggered after the second failed workflow attempt; moving earlier dilutes impact.
- Messaging that references *community leaderboard* language connects with GenZ cohorts but confuses Enterprise admins—keep segmentation strict.
- Support spike among Freelancer Collective correlates with the dashboard shipping before enablement docs; pair future rollouts with comms kits.

---

### 4. Recommendations
1. **Graduate Personalized Nudges** to 100% for GenZ Solopreneurs; set success guardrails at +5 pts retention and ≤3 ticket delta.
2. **Bundle Enablement Toolkit** (FAQ, Loom walkthrough, escalation tree) one sprint before next market rollouts.
3. **Ship Cohort Explorer** to growth + product weekly so hypotheses can be tested self-serve; backlog top 3 follow-up experiments.

---

### 5. Next Experiments
| Hypothesis | Metric | Est. Lift | Owner |
|------------|--------|-----------|-------|
| Pair nudges with calendar reminders | Week 4 retention | +3 pts | Lifecycle PM |
| Offer “co-build office hours” to Freelancers | Expansion revenue | +10% | Community Lead |
| Instrument support intent taxonomy | Ticket-to-resolution time | -15% | Support Ops |

---

### 6. Attachments
- Cohort Explorer React prototype (`src/components/DataStorytellingLab.jsx`)
- Notebook excerpt (`/notebooks/data_storytelling.ipynb`, pending upload)
- KPI snapshots (`/src/assets/data-lab/retention.png`, pending upload)

