import { api } from './api';

export const offerings = {
    getAll: () => api('/offerings'),
    get: (id: number) => api(`/offerings/${id}`),
    create: (data: { profile_id: number; offering_type: string; price: number; conditions?: string; duration?: string }) =>
        api('/offerings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api(`/offerings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/offerings/${id}`, { method: 'DELETE' }),
};

