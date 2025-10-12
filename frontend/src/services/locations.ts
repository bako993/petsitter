import { api } from './api';

export type LocationData = {
    latitude: number;
    longitude: number;
    city: string;
    postal_code: string;
    street: string;
    house_number: string;
    full_address: string;
};

export const locations = {
    getAll: async () => {
        return api('/locations');
    },
    get: async (id: number) => {
        return api(`/locations/${id}`);
    },
    create: async (data: LocationData) => {
        return api('/locations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: number, data: Partial<LocationData>) => {
        return api(`/locations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id: number) => {
        return api(`/locations/${id}`, {
            method: 'DELETE',
        });
    },
};
