import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/src/services/api";

type ApiQueryOptions<T> = {
    key: string | any[];
    endpoint: string;
    options?: UseQueryOptions<T>;
    enabled?: boolean;
};

export function useApiQuery<T = any>({
                                         key,
                                         endpoint,
                                         options,
                                         enabled = true,
                                     }: ApiQueryOptions<T>) {
    return useQuery<T>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async () => api(endpoint),
        enabled,
        ...options,
    });
}
