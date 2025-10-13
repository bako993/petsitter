import { useState } from 'react';
import { users } from '../services/users';

export const useUsers = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getUserById = async (id: number) => {
        setLoading(true);
        try {
            const res = await users.get(id);
            setData(res);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, getUserById };
};
