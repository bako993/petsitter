import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { LocationData } from "../services/locations";

export const useLocations = () => {
    const getLocations = useApiQuery<LocationData[]>({
        key: "locations",
        endpoint: "/locations",
    });

    const getLocation = (id: number) =>
        useApiQuery<LocationData>({
            key: ["locations", id],
            endpoint: `/locations/${id}`,
        });

    const createLocation = useApiMutation<LocationData, LocationData>({
        endpoint: "/locations",
        method: "POST",
    });

    const updateLocation = useApiMutation<LocationData, { id: number; data: Partial<LocationData> }>({
        endpoint: "/locations",
        method: "PUT",
    });

    const deleteLocation = useApiMutation<void, number>({
        endpoint: "/locations",
        method: "DELETE",
    });

    return { getLocations, getLocation, createLocation, updateLocation, deleteLocation };
};
