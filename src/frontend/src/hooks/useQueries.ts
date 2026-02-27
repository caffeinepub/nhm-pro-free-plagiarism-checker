import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CheckRecord } from "../backend.d";
import { useActor } from "./useActor";

export function useListChecks() {
  const { actor, isFetching } = useActor();
  return useQuery<CheckRecord[]>({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChecks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCheck(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<CheckRecord | null>({
    queryKey: ["check", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCheck(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSaveCheck() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      text: string;
      plagiarismScore: number;
      aiScore: number;
      mode: string;
      wordCount: bigint;
    }
  >({
    mutationFn: async ({ text, plagiarismScore, aiScore, mode, wordCount }) => {
      if (!actor) throw new Error("No actor available");
      return actor.saveCheck(text, plagiarismScore, aiScore, mode, wordCount);
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

export function useSubmitSuggestion() {
  const { actor } = useActor();
  return useMutation<bigint, Error, { name: string | null; message: string }>({
    mutationFn: async ({ name, message }) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitSuggestion(name, message);
    },
  });
}

// Legacy alias kept for compatibility
export const useSubmitCheck = useSaveCheck;
export const useGetHistory = useListChecks;
