## Inclusive QA Report — Creator Hub Web App

**Auditor:** Zohaib Cheema  
**Date:** November 14, 2025  
**Scope:** Marketing landing pages + dashboard (desktop + mobile)

---

### 1. Key Metrics
- **WCAG 2.1 AA coverage:** 94%
- **Average contrast ratio:** 4.8:1 (target ≥ 4.5:1)
- **Keyboard nav success:** 22/24 flows pass
- **Screen reader time-on-task:** 2m 15s (baseline 3m 10s)

---

### 2. Findings & Fixes
| ID | Category | Severity | Finding | Remedy |
|----|----------|----------|---------|--------|
| A11Y-001 | Contrast | High | CTA gradient text dropped to 3.1:1 on hover | Darken gradient stop + add outline focus |
| A11Y-002 | Forms | Medium | Placeholder-only labels on newsletter form | Promoted labels + ARIA-describedby hints |
| A11Y-003 | Motion | Medium | Hero particles caused vestibular issues | Added “reduce motion” toggle and respects OS setting |
| A11Y-004 | Keyboard | Medium | Modal close button skipped in tab order | Added `tabindex="0"` + focus trap |

---

### 3. User Testing Notes
1. **Low-vision tester**: Appreciated high-contrast toggle but requested persistent setting → stored in localStorage.
2. **Screen-reader power user**: Needed skip links to bypass hero → implemented `Skip to content` anchor.
3. **Neurodivergent tester**: Preferred condensed copy; added “focus mode” state that hides background animations.

---

### 4. Regression Suite
- `npm run accessibility:audit` (axe-core + pa11y CLI)
- `npm run accessibility:contrast` (custom script verifying >4.5:1)
- Storybook stories include a11y snapshots for hero, cards, forms.

---

### 5. Next Enhancements
1. Localize ARIA labels (Spanish + Hindi) before launching to LATAM/APAC.
2. Add cognitive load checklist to design QA.
3. Automate video captions via AWS Transcribe + manual QA.

---

### 6. Attachments
- `/src/components/InclusiveDesignLab.jsx` — Interactive overview
- `/public/artifacts/inclusive-qa-report.md` — This report
- (Optional) `/public/assets/a11y-before-after.png` — screenshot gallery

