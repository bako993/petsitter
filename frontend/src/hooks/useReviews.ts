import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { ReviewData, reviews } from "../services/reviews";

export const useReviews = () => {
    const getReviews = useApiQuery<ReviewData[]>({
        key: "reviews",
        endpoint: "/reviews",
    });

    const getReview = (id: number) =>
        useApiQuery<ReviewData>({
            key: ["reviews", id],
            endpoint: `/reviews/${id}`,
        });

    const createReview = useApiMutation<ReviewData, ReviewData>({
        endpoint: "/reviews",
        method: "POST",
        options: { mutationFn: (data) => reviews.create(data) },
    });

    const updateReview = useApiMutation<ReviewData, { id: number; data: Partial<ReviewData> }>({
        endpoint: "/reviews",
        method: "PUT",
        options: { mutationFn: ({ id, data }) => reviews.update(id, data) },
    });

    const deleteReview = useApiMutation<void, number>({
        endpoint: "/reviews",
        method: "DELETE",
        options: { mutationFn: (id) => reviews.delete(id) },
    });

    return { getReviews, getReview, createReview, updateReview, deleteReview };
};
