// hooks/useOfferings.ts
import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { OfferingData, offerings } from "../services/offerings";

export const useOfferings = () => {
    const getOfferings = useApiQuery<OfferingData[]>({
        key: "offerings",
        endpoint: "/offerings",
    });

    const getOffering = (id: number) =>
        useApiQuery<OfferingData>({
            key: ["offerings", id],
            endpoint: `/offerings/${id}`,
        });

    const createOffering = useApiMutation<OfferingData, OfferingData>({
        endpoint: "/offerings",
        method: "POST",
        options: { mutationFn: (data) => offerings.create(data) },
    });

    const updateOffering = useApiMutation<OfferingData, { id: number; data: Partial<OfferingData> }>({
        endpoint: "/offerings",
        method: "PUT",
        options: {
            mutationFn: ({ id, data }) => offerings.update(id, data),
        }
    });

    const deleteOffering = useApiMutation<void, number>({
        endpoint: "/offerings",
        method: "DELETE",
        options: { mutationFn: (id) => offerings.delete(id) },
    });

    return { getOfferings, getOffering, createOffering, updateOffering, deleteOffering };
};
