import { createActor } from "@/backend";
import { type Bill, toBill } from "@/types/bill";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BILL_QUERY_KEY = ["active-bill"] as const;

/**
 * Read the active bill from the backend.
 *
 * `useActor` is called at the hook top level (never inside the query callback)
 * so the actor identity stays stable across renders.
 */
export function useActiveBill() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Bill>({
    queryKey: BILL_QUERY_KEY,
    queryFn: async () => {
      if (!actor) throw new Error("Backend belum siap");
      return toBill(await actor.getActiveBill());
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Mark the active bill as paid and refresh the cached bill on success.
 */
export function usePayActiveBill() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Bill, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend belum siap");
      return toBill(await actor.payActiveBill());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BILL_QUERY_KEY });
    },
  });
}
