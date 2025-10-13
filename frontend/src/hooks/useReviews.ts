import { useState, useEffect } from 'react';
import { reviews } from '../services/reviews';

export const useReviews = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await reviews.getAll();
            setData(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchReviews();
        })();
    }, []);

    return { data, loading, error, refresh: fetchReviews };
};
