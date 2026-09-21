import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentSuccess } from "@/components/PaymentSuccess";

/**
 * Post-confirm status panel.
 *
 * The panel now reports a service disruption instead of a success. These tests
 * pin the accepted warning state (triangle icon, exact heading and body copy)
 * and the surrounding behavior that must survive the change: the panel renders
 * as a single `payment.success_state` section, it shows the confirmed nominal
 * with Indonesian grouping, and it keeps the amount as the panel's own content.
 */
describe("PaymentSuccess panel", () => {
  it("renders the confirmed nominal inside the status panel", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    expect(panel.tagName).toBe("SECTION");
    expect(within(panel).getByText("Rp 1.200.000")).toBeInTheDocument();
  });

  it("shows the service-disruption warning heading and body copy", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    expect(
      within(panel).getByRole("heading", {
        name: "Gangguan layanan pembayaran",
      }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText("Sistem pembayaran sedang mengalami gangguan."),
    ).toBeInTheDocument();
  });

  it("keeps the disruption notice free of the word 'simulasi'", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    // The accepted requirement removes 'simulasi' from the interface copy; the
    // notice must stay meaningful without it.
    expect(within(panel).queryByText(/simulasi/i)).not.toBeInTheDocument();
    expect(panel.textContent ?? "").not.toMatch(/simulasi/i);
  });

  it("no longer shows the previous success copy", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    expect(
      within(panel).queryByText("Pembayaran Berhasil"),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByText("Tagihan Anda telah dikonfirmasi."),
    ).not.toBeInTheDocument();
  });

  it("renders a triangle warning icon in the warning badge", () => {
    const { container } = render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    // The badge is decorative, so it is hidden from the accessibility tree;
    // assert on the rendered SVG shape instead.
    const icon = panel.querySelector("svg.lucide-triangle-alert");
    expect(icon).not.toBeNull();
    // The warning tint lives on the badge wrapper, which is the icon's parent.
    expect(icon?.parentElement).toHaveClass("text-warning");
    expect(
      container.querySelectorAll("svg.lucide-triangle-alert"),
    ).toHaveLength(1);
  });

  it("formats the nominal with Indonesian grouping for other amounts", () => {
    render(<PaymentSuccess amount={999n} />);

    const panel = screen.getByTestId("payment.success_state");
    expect(within(panel).getByText("Rp 999")).toBeInTheDocument();
  });

  it("keeps the amount as the panel's only numeric content", () => {
    render(<PaymentSuccess amount={1_234_567_890n} />);

    const panel = screen.getByTestId("payment.success_state");
    expect(within(panel).getByText("Rp 1.234.567.890")).toBeInTheDocument();
    // The panel is a self-contained status card: exactly one section, and the
    // amount is rendered once (no duplicated nominal inside the panel).
    expect(within(panel).getAllByText(/^Rp /)).toHaveLength(1);
  });
});

/**
 * Stable copy contract for the disruption notice.
 *
 * The accepted requirement trims the trailing qualifier from the notice body,
 * so the exact sentence is intentionally changing and must not be frozen here.
 * These tests protect what survives that edit: the notice keeps its stable
 * opening clause, it stays a single paragraph, and the panel heading stays
 * distinct from the screen heading that owns the post-confirm state.
 */
describe("PaymentSuccess disruption notice contract", () => {
  it("keeps the stable opening clause of the disruption notice", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    // Prefix match: the sentence must still open with the disruption clause,
    // regardless of how the trailing qualifier is worded.
    expect(
      within(panel).getByText(/^Sistem pembayaran sedang mengalami gangguan/),
    ).toBeInTheDocument();
  });

  it("renders the disruption notice as a single paragraph", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    const notice = within(panel).getByText(
      /^Sistem pembayaran sedang mengalami gangguan/,
    );
    expect(notice.tagName).toBe("P");
    // Exactly one paragraph carries the notice; the nominal is a separate
    // paragraph, so the notice must not be split or duplicated.
    expect(within(panel).getAllByText(/Sistem pembayaran/)).toHaveLength(1);
  });

  it("keeps the panel heading distinct from the post-confirm screen heading", () => {
    render(<PaymentSuccess amount={1_200_000n} />);

    const panel = screen.getByTestId("payment.success_state");
    // The panel owns the disruption heading; the screen heading
    // ("Konfirmasi Selesai") lives in PaymentPage, not inside the panel.
    expect(
      within(panel).getByRole("heading", {
        name: "Gangguan layanan pembayaran",
      }),
    ).toBeInTheDocument();
    expect(
      within(panel).queryByRole("heading", { name: "Konfirmasi Selesai" }),
    ).not.toBeInTheDocument();
  });
});
