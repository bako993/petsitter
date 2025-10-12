import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { ProfileData, profiles } from "../services/profiles";

export const useProfiles = () => {
    const getProfiles = useApiQuery<ProfileData[]>({
        key: "profiles",
        endpoint: "/profiles",
    });

    const getProfile = (id: number) =>
        useApiQuery<ProfileData>({
            key: ["profiles", id],
            endpoint: `/profiles/${id}`,
        });

    const createProfile = useApiMutation<ProfileData, ProfileData>({
        endpoint: "/profiles",
        method: "POST",
        options: {
            mutationFn: (data: ProfileData) => profiles.create(data),
        },
    });

    const updateProfile = useApiMutation<ProfileData, { id: number; data: Partial<ProfileData> }>({
        endpoint: "/profiles",
        method: "PUT",
        options: {
            mutationFn: ({ id, data }) => profiles.update(id, data),
        },
    });

    const deleteProfile = useApiMutation<void, number>({
        endpoint: "/profiles",
        method: "DELETE",
        options: {
            mutationFn: (id: number) => profiles.delete(id),
        },
    });

    return { getProfiles, getProfile, createProfile, updateProfile, deleteProfile };
};
