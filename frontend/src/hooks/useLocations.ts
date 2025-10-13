import { useState, useEffect } from 'react';
import { locations } from '../services/locations';

export const useLocations = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await locations.getAll();
            setData(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchLocations();
        })();
    }, []);

    return { data, loading, error, refresh: fetchLocations };
};

