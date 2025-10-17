import { useState, useCallback } from 'react';
import { reviews } from '../services/reviews';

export const useReviews = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await reviews.getAll();
            setData(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting reviews: ", err);
            setError(err.message || 'Failed to get reviews');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createReview = useCallback(async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await reviews.create(payload);
            setData(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error creating reviews: ", err);
            setError(err.message || 'Failed to create reviews');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, getReviews, createReview };
};
