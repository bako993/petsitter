import { useState } from 'react';
import { users } from '../services/users';
import { User } from '@/src/types/types'

export const useUsers = () => {
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getUserById = async (id: number) => {
        setLoading(true);
        try {
            const res = await users.get(id);
            setData(res.data);
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const updateUser = async (id: number, data: Partial<User>) => {
        setLoading(true);
        try {
            const res = await users.update(id, data);
            setData(res.data);
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return { data, loading, error, getUserById, updateUser };
};
