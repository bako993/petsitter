// services/users.ts
import { api } from './api';

export type UserData = {
    name: string;
    email: string;
    password?: string;
    role?: 'admin' | 'user';
    type?: 'owner' | 'sitter';
};

export const users = {
    getAll: async () => api('/users'),
    get: async (id: number) => api(`/users/${id}`),
    create: async (data: UserData) =>
        api('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: async (id: number, data: Partial<UserData>) =>
        api(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: async (id: number) =>
        api(`/users/${id}`, {
            method: 'DELETE',
        }),
};






// import { api } from "@/src/services/api";
//
// export const users = {
//     getById: async (id: number) => {
//         return api(`/users/${id}`, { method: "GET" });
//     },
// };
