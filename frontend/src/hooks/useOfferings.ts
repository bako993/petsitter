import { useState, useEffect } from 'react';
import { offerings } from '../services/offerings';

export const useOfferings = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const res = await offerings.getAll();
            setData(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchOfferings();
        })();
    }, []);

    return { data, loading, error, refresh: fetchOfferings };
};
