import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveBill, usePayActiveBill } from "@/hooks/use-bill";
import {
  type BillActor,
  PAID_BILL_VIEW,
  SEEDED_BILL_VIEW,
  createBillActor,
} from "@/test/bill-fixtures";

const actorRef: { current: BillActor } = { current: createBillActor() };

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  actorRef.current = createBillActor();
});

describe("useActiveBill", () => {
  it("maps the backend BillView onto the frontend Bill shape", async () => {
    const { result } = renderHook(() => useActiveBill(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      id: SEEDED_BILL_VIEW.id,
      title: SEEDED_BILL_VIEW.title,
      amount: SEEDED_BILL_VIEW.amount,
      paymentStatus: SEEDED_BILL_VIEW.paymentStatus,
      confirmationStatus: SEEDED_BILL_VIEW.confirmationStatus,
      paid: SEEDED_BILL_VIEW.paid,
      updatedAt: SEEDED_BILL_VIEW.updatedAt,
    });
  });

  it("surfaces a backend read failure as a query error", async () => {
    actorRef.current = createBillActor({
      getActiveBill: async () => {
        throw new Error("canister unreachable");
      },
    });

    const { result } = renderHook(() => useActiveBill(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("canister unreachable");
  });
});

describe("usePayActiveBill", () => {
  it("returns the paid bill and refreshes the cached active bill", async () => {
    const { result } = renderHook(
      () => ({ bill: useActiveBill(), pay: usePayActiveBill() }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.bill.isSuccess).toBe(true));

    result.current.pay.mutate();

    await waitFor(() => expect(result.current.pay.isSuccess).toBe(true));
    expect(result.current.pay.data).toMatchObject({
      paid: true,
      paymentStatus: "Lunas",
      amount: PAID_BILL_VIEW.amount,
    });
  });
});
