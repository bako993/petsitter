import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";

type ApiMutationOptions<TData, TVariables> = {
    endpoint: string;
    method?: "POST" | "PUT" | "DELETE";
    options?: UseMutationOptions<TData, Error, TVariables>;
};

export function useApiMutation<TData = any, TVariables = any>({
          endpoint,
          method = "POST",
          options,
        }: ApiMutationOptions<TData, TVariables>) {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
    mutationFn: (body: TVariables) =>
    api(endpoint, {
    method,
    body: JSON.stringify(body),
    }),
    ...options,
    });
}