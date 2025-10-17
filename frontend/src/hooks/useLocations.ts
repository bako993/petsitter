import {useCallback, useState} from 'react';
import {locations} from '../services/locations';

export const useLocations = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await locations.getAll();
            setData(res.data);
            return res.data;
        } catch (error: any) {
            console.error("Error fetching locations:", error);
            setError(error.message || 'Failed to fetch offerings');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const createLocation = useCallback(async (payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await locations.create(payload);
            setData(res.data);
            return res.data;
        } catch (error: any) {
            setError(error.message || 'Failed to create location');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLocation = useCallback(async (id: number, payload: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await locations.update(id, payload);
            setData(res.data);
            return res.data;
        } catch (error: any) {
            setError(error.message || 'Failed to update location');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, getLocations, createLocation, updateLocation };
};

