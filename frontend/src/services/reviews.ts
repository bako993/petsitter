import { api } from './api';

export type ReviewData = {
    profile_id: number;
    rating: number;
    comment: string;
};

export const reviews = {
    getAll: async () => api('/reviews'),
    get: async (id: number) => api(`/reviews/${id}`),
    create: async (data: ReviewData) =>
        api('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: async (id: number, data: Partial<ReviewData>) =>
        api(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: async (id: number) =>
        api(`/reviews/${id}`, {
            method: 'DELETE',
        }),
};
