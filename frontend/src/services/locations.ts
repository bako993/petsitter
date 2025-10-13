import { api } from './api';

export const locations = {
    getAll: () => api('/locations'),
    get: (id: number) => api(`/locations/${id}`),
    create: (data: {
        latitude: number;
        longitude: number;
        city: string;
        postal_code: string;
        street: string;
        house_number: string;
        full_address: string;
    }) => api('/locations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/locations/${id}`, { method: 'DELETE' }),
};
