import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaymentPage } from "@/pages/PaymentPage";
import { type BillActor, createBillActor } from "@/test/bill-fixtures";

/**
 * Payment confirmation screen.
 *
 * The post-confirm status panel now reports a service disruption instead of a
 * success. These tests pin the accepted warning state and protect the
 * surrounding behavior that must survive the change: the confirmation state,
 * the route/heading switch, the confirmed nominal, the return controls, the
 * error path, and the single backend call per confirmation.
 */
const actorRef: { current: BillActor } = { current: createBillActor() };

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function renderPaymentPage(onBack: () => void = () => {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentPage onBack={onBack} />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  actorRef.current = createBillActor();
});

describe("confirmation state", () => {
  it("shows the bill summary and the confirm CTA before confirming", async () => {
    renderPaymentPage();

    expect(
      screen.getByRole("heading", { name: "Konfirmasi Pembayaran" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Periksa kembali rincian tagihan Anda sebelum melanjutkan.",
      ),
    ).toBeInTheDocument();

    // The summary card carries the bill label and the resolved nominal.
    // The label is uppercased by CSS, so the DOM text stays title-case.
    const summary = screen.getByText("Tagihan Saat Ini").closest("section");
    expect(summary).not.toBeNull();
    expect(
      within(summary as HTMLElement).getByText("Rp 1.200.000"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Pratinjau aman")).toBeInTheDocument();
  });

  it("invokes onBack from the back control without confirming", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderPaymentPage(onBack);

    await user.click(screen.getByRole("button", { name: "Kembali" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe("post-confirm state", () => {
  it("switches the heading and keeps the confirmed nominal on the same screen", async () => {
    const user = userEvent.setup();
    renderPaymentPage();

    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Konfirmasi Selesai" }),
      ).toBeInTheDocument();
    });

    // Still the payment route: the back control remains, and the confirmation
    // summary/CTA are gone.
    expect(screen.getByRole("button", { name: "Kembali" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Konfirmasi Pembayaran/i }),
    ).not.toBeInTheDocument();

    // The confirmed nominal is still shown on the post-confirm screen (the
    // panel and the footer both render it, so assert on the count).
    expect(screen.getAllByText("Rp 1.200.000").length).toBeGreaterThan(0);
  });

  it("shows the service-disruption warning panel after confirming", async () => {
    const user = userEvent.setup();
    renderPaymentPage();

    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    const panel = await screen.findByTestId("payment.success_state");
    expect(
      within(panel).getByRole("heading", {
        name: "Gangguan layanan pembayaran",
      }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText("Sistem pembayaran sedang mengalami gangguan."),
    ).toBeInTheDocument();
    expect(panel.querySelector("svg.lucide-triangle-alert")).not.toBeNull();

    // The previous success copy is gone from the whole screen.
    expect(screen.queryByText("Pembayaran Berhasil")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Tagihan Anda telah dikonfirmasi."),
    ).not.toBeInTheDocument();
  });

  it("offers a return-to-home action that calls onBack", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderPaymentPage(onBack);

    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );
    await screen.findByRole("heading", { name: "Konfirmasi Selesai" });

    await user.click(
      screen.getByRole("button", { name: "Kembali ke Beranda" }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls the backend pay method exactly once per confirmation", async () => {
    const user = userEvent.setup();
    const payActiveBill = vi.fn(async () => createBillActor().payActiveBill());
    actorRef.current = createBillActor({ payActiveBill });

    renderPaymentPage();
    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    await waitFor(() => expect(payActiveBill).toHaveBeenCalledTimes(1));
  });
});

describe("error path", () => {
  it("shows the error alert and a retry CTA when the confirmation fails", async () => {
    const user = userEvent.setup();
    actorRef.current = createBillActor({
      payActiveBill: async () => {
        throw new Error("canister unreachable");
      },
    });

    renderPaymentPage();
    await user.click(
      screen.getByRole("button", { name: /Konfirmasi Pembayaran/i }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Konfirmasi gagal diproses. Silakan coba lagi.",
    );

    // The screen stays in the confirmation state and offers a retry.
    expect(
      screen.getByRole("heading", { name: "Konfirmasi Pembayaran" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Coba Lagi/i }),
    ).toBeInTheDocument();
  });
});
