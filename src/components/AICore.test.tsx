import { render, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AICore from "./AICore";
afterEach(() => vi.unstubAllGlobals());
function setupMedia(reduced: boolean, fine: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduced-motion") ? reduced : fine,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
}
function move(art: Element) {
  vi.spyOn(art, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 200, 200),
  );
  const event = new Event("pointermove", { bubbles: true });
  Object.assign(event, { pointerType: "mouse", clientX: 180, clientY: 140 });
  fireEvent(art, event);
}
describe("AI core interaction preferences", () => {
  it("responds to a desktop pointer and resets on exit", () => {
    setupMedia(false, true);
    const { container } = render(<AICore />);
    const art = container.querySelector(".hero-art")!;
    move(art);
    expect(art).toHaveAttribute("data-interacting", "true");
    expect(container.querySelector(".orbital-stage")).toHaveStyle(
      "--core-x: 6.4px",
    );
    fireEvent.pointerLeave(art);
    expect(art).not.toHaveAttribute("data-interacting");
    expect(
      (
        container.querySelector(".orbital-stage") as HTMLElement
      ).style.getPropertyValue("--core-x"),
    ).toBe("");
  });
  it.each([
    [true, true, "reduced motion"],
    [false, false, "touch devices"],
  ])("ignores pointer movement for %s/%s (%s)", (reduced, fine) => {
    setupMedia(reduced as boolean, fine as boolean);
    const { container } = render(<AICore />);
    const art = container.querySelector(".hero-art")!;
    move(art);
    expect(art).not.toHaveAttribute("data-interacting");
    expect(
      (
        container.querySelector(".orbital-stage") as HTMLElement
      ).style.getPropertyValue("--core-x"),
    ).toBe("");
  });
});
