import { useState, useCallback } from "react";
import { profiles } from "../services/profiles";

export const useProfiles = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProfileById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await profiles.get(id);
            setProfile(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.message || "Failed to fetch profile");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (id: number, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await profiles.update(id, data);
            setProfile(res.data);
            return res.data;
        } catch (err: any) {
            console.warn("Error in updateProfile:", err);
            setError(err.message || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProfile = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await profiles.create(data);
            setProfile(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.message || "Failed to create profile");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { profile, loading, error, getProfileById, updateProfile, createProfile, setProfile };
};
