import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkillShowcases from "../SkillShowcases";
import { SKILL_PLAYGROUNDS } from "../../constants";

describe("SkillShowcases", () => {
  it("renders a card for every skill playground", () => {
    render(<SkillShowcases />);

    SKILL_PLAYGROUNDS.forEach((playground) => {
      expect(screen.getByText(playground.title)).toBeInTheDocument();
      expect(screen.getByText(playground.summary)).toBeInTheDocument();
    });
  });

  it("exposes CTA links for each playground", () => {
    render(<SkillShowcases />);

    SKILL_PLAYGROUNDS.forEach((playground) => {
      const links = screen.getAllByRole("link", { name: new RegExp(playground.ctaLabel, "i") });
      expect(
        links.some((link) => link.getAttribute("href") === playground.ctaLink)
      ).toBe(true);
    });
  });
});

