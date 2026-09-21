import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { type BillActor, createBillActor } from "@/test/bill-fixtures";

/**
 * The app's data seam is `useActor` from `@caffeineai/core-infrastructure`.
 * Mocking that module keeps the real `use-bill` hooks, the real React Query
 * cache, and every real component in the tree, while replacing only the
 * canister round-trip with a typed local actor.
 */
const actorRef: { current: BillActor } = { current: createBillActor() };

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  actorRef.current = createBillActor();
});

describe("home screen", () => {
  it("renders the header, hero headline, bill card, and primary CTA", async () => {
    renderApp();

    // Header: brand line + mint shield affordance.
    expect(screen.getByText("Limit Pinjaman")).toBeInTheDocument();
    expect(screen.getByLabelText("Keamanan terjamin")).toBeInTheDocument();

    // Hero headline: three lines, the last carrying the mint accent.
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Tenang,");
    expect(heading).toHaveTextContent("semua");
    const accent = within(heading).getByText("terkendali.");
    expect(accent).toHaveClass("text-accent-mint");

    expect(
      screen.getByText(
        "Lihat bagaimana pembayaran tagihan bekerja dalam lingkungan yang aman.",
      ),
    ).toBeInTheDocument();

    // Bill card: label, badge, nominal, and payment-status row. The nominal
    // resolves from the mocked actor, so wait for it to replace the skeleton.
    const card = screen.getByRole("region", { name: "Tagihan Saat Ini" });
    expect(within(card).getByText("Tagihan Saat Ini")).toBeInTheDocument();
    expect(within(card).getByText("Terkonfirmasi")).toBeInTheDocument();
    expect(await within(card).findByText("Rp 1.200.000")).toBeInTheDocument();
    expect(within(card).getByText("Status pembayaran")).toBeInTheDocument();
    expect(within(card).getByText("Belum Lunas")).toBeInTheDocument();

    // Primary CTA.
    expect(
      screen.getByRole("button", { name: /Bayar Tagihan Sekarang/i }),
    ).toBeInTheDocument();
  });

  it("never asks for a credential and never labels the flow as a demo", async () => {
    renderApp();

    await screen.findByText("Rp 1.200.000");

    expect(screen.queryByLabelText(/pin/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/otp/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nomor kartu/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/rekening/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/demo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/simulasi/i)).not.toBeInTheDocument();
  });
});

describe("payment journey", () => {
  it("opens one confirmation screen showing the Rp 1.200.000 summary", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole("button", { name: /Bayar Tagihan Sekarang/i }),
    );

    expect(
      screen.getByRole("heading", { name: "Konfirmasi Pembayaran" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rp 1.200.000")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    ).toBeInTheDocument();
  });

  it("shows the post-confirm status panel on the same screen after confirming", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole("button", { name: /Bayar Tagihan Sekarang/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    // The post-confirm status panel reports a service disruption. This journey
    // protects the route/heading switch, the same-screen back control, the
    // confirmed nominal on the panel itself, and the accepted warning copy.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Konfirmasi Selesai" }),
      ).toBeInTheDocument();
    });
    // Still the payment route, not a new page: the back control remains.
    expect(screen.getByRole("button", { name: "Kembali" })).toBeInTheDocument();
    // The confirmed nominal is shown on the post-confirm panel itself.
    const panel = document.querySelector('[data-ocid="payment.success_state"]');
    expect(panel).not.toBeNull();
    expect(
      within(panel as HTMLElement).getByText("Rp 1.200.000"),
    ).toBeInTheDocument();
    expect(
      within(panel as HTMLElement).getByRole("heading", {
        name: "Gangguan layanan pembayaran",
      }),
    ).toBeInTheDocument();
    expect(
      within(panel as HTMLElement).getByText(
        "Sistem pembayaran sedang mengalami gangguan.",
      ),
    ).toBeInTheDocument();
    expect(
      (panel as HTMLElement).querySelector("svg.lucide-triangle-alert"),
    ).not.toBeNull();
  });

  it("calls the backend pay method exactly once per confirmation", async () => {
    const user = userEvent.setup();
    const payActiveBill = vi.fn(async () => createBillActor().payActiveBill());
    actorRef.current = createBillActor({ payActiveBill });

    renderApp();
    await user.click(
      screen.getByRole("button", { name: /Bayar Tagihan Sekarang/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    await waitFor(() => expect(payActiveBill).toHaveBeenCalledTimes(1));
  });

  it("never shows the word 'simulasi' on either route", async () => {
    const user = userEvent.setup();
    renderApp();

    // Home route.
    await screen.findByText("Rp 1.200.000");
    expect(screen.queryByText(/simulasi/i)).not.toBeInTheDocument();

    // Payment route, confirmation state.
    await user.click(
      screen.getByRole("button", { name: /Bayar Tagihan Sekarang/i }),
    );
    expect(
      screen.getByRole("heading", { name: "Konfirmasi Pembayaran" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/simulasi/i)).not.toBeInTheDocument();

    // Payment route, post-confirm state.
    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );
    await screen.findByRole("heading", { name: "Konfirmasi Selesai" });
    expect(screen.queryByText(/simulasi/i)).not.toBeInTheDocument();
  });
});
