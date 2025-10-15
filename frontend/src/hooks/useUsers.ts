import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { users } from "../services/users";
import { User } from "@/src/types/types";

export const useUsers = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchUserById = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const res = await users.get(id);
            setUser(res.data);
            await SecureStore.setItemAsync("user", JSON.stringify({ data: res.data }));
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUserById = useCallback(async (id: number, data: any) => {
        await users.update(id, data);
        return fetchUserById(id);
    }, [fetchUserById]);

    const loadStoredUser = useCallback(async () => {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed.data);
            return parsed.data;
        }
        return null;
    }, []);

    return { user, loading, error, fetchUserById, updateUserById, loadStoredUser, setUser };
};
