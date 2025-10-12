import { api } from './api';

export type OfferingData = {
    profile_id: number;
    offering_type: 'dog_walking' | 'sitting' | 'grooming' | 'night_stay';
    price: number;
    conditions: string;
    duration: string;
};

export const offerings = {
    getAll: async () => api('/offerings'),
    get: async (id: number) => api(`/offerings/${id}`),
    create: async (data: OfferingData) =>
        api('/offerings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: async (id: number, data: Partial<OfferingData>) =>
        api(`/offerings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: async (id: number) =>
        api(`/offerings/${id}`, {
            method: 'DELETE',
        }),
};
