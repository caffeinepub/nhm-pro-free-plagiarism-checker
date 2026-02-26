import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { CheckResult, CheckSummary } from "../backend.d";

export function useGetHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<CheckSummary[]>({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCheck(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<CheckResult | null>({
    queryKey: ["check", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCheck(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitCheck() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<CheckResult, Error, string>({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitCheck(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useDeleteCheck() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deleteCheck(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
