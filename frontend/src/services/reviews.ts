import { api } from './api';

export const reviews = {
    getAll: () => api('/reviews'),
    get: (id: number) => api(`/reviews/${id}`),
    create: (data: { profile_id: number; rating: number; comment: string }) =>
        api('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/reviews/${id}`, { method: 'DELETE' }),
};
