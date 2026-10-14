import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import App from "./App";
import projects from "./data/projects.json";
describe("XAVIC-Labs website", () => {
  afterEach(() => window.history.replaceState({}, "", "/"));
  it("renders official identity and all specified sections", () => {
    render(<App />);
    for (const id of [
      "about",
      "projects",
      "laboratory",
      "command-center",
      "timeline",
      "technology",
      "founder",
      "contact",
    ])
      expect(document.getElementById(id)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "One Vision.Intelligent Systems.Endless Possibilities.",
    );
    expect(
      screen.getByRole("link", { name: /Explore Projects/ }),
    ).toHaveAttribute("href", "#projects");
    expect(
      screen.getByRole("link", { name: /Discover the Lab/ }),
    ).toHaveAttribute("href", "#about");
    expect(
      screen.getByText(
        "An independent AI development laboratory engineering intelligent, adaptive, and practical systems that enhance productivity, creativity, and everyday life.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jae Picardo." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Experimental Robotics" }),
    ).toBeInTheDocument();
  });
  it("links every portfolio card to its dedicated page", () => {
    render(<App />);
    for (const project of projects)
      expect(
        screen.getByRole("link", { name: `View ${project.name} project` }),
      ).toHaveAttribute("href", `./projects/${project.slug}/`);
  });
  it.each(projects)("renders $name details with accurate status", (project) => {
    window.history.replaceState({}, "", `/projects/${project.slug}/`);
    render(<App />);
    expect(
      screen.getByRole("heading", { name: project.name, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.status)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "XAVIC-Labs home" }),
    ).toHaveLength(2);
    for (const logo of document.querySelectorAll<HTMLImageElement>(
      "img.brand-mark",
    ))
      expect(logo.getAttribute("src")).toBe("../../xavic-emblem.svg");
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to projects/ }),
    ).toHaveAttribute("href", "../../#projects");
  });
  it("opens the mobile menu and closes it after navigation", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("shows honest contact preview feedback without claiming delivery", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Your name"), {
      target: { value: "Reviewer" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "reviewer@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Your message"), {
      target: { value: "An idea for the lab" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Preview contact request/ }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your message has not been sent.",
    );
    expect(screen.getAllByText("To be announced")).toHaveLength(3);
  });
  it("handles unknown project routes", () => {
    window.history.replaceState({}, "", "/projects/missing/");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Project not found" }),
    ).toBeInTheDocument();
  });
});
