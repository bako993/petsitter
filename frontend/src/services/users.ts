import { api } from './api';

export const users = {
    getAll: () => api('/users'), // admin only
    get: (id: number) => api(`/users/${id}`),
    create: (data: { name: string; email: string; password: string; role?: string; type?: string }) =>
        api('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api(`/users/${id}`, { method: 'DELETE' }),
};
