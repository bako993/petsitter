import { useState, useCallback } from 'react';
import { offerings } from '../services/offerings';
import { Offering } from '@/src/types/types';

export const useOfferings = () => {
    const [data, setData] = useState<Offering[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllOfferings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await offerings.getAll();
            setData(res.data as Offering[]);
            return res.data as Offering[];
        } catch (err: any) {
            setError(err.message || 'Failed to fetch offerings');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getOfferingById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await offerings.get(id);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch offering');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createOffering = useCallback(async (offeringData: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await offerings.create(offeringData);
            setData(prev => [...prev, res.data as Offering]);
            return res.data as Offering;
        } catch (err: any) {
            setError(err.message || 'Failed to create offering');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateOffering = useCallback(async (id: number, offeringData: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await offerings.update(id, offeringData);
            setData(prev => prev.map(o => (o.id === id ? res.data as Offering: o)));
            return res.data as Offering;
        } catch (err: any) {
            setError(err.message || 'Failed to update offering');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteOffering = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await offerings.delete(id);
            setData(prev => prev.filter(o => o.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete offering');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        getAllOfferings,
        getOfferingById,
        createOffering,
        updateOffering,
        deleteOffering,
        setData,
    };
};
