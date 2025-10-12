import { api } from './api';

export type ProfileData = {
    bio: string;
    experience: string;
    phone: string;
    availability: string;
    photo?: string | null;
};

export const profiles = {
    getAll: async () => {
        return api('/profiles');
    },

    get: async (id: number) => {
        return api(`/profiles/${id}`);
    },

    create: async (data: ProfileData) => {
        const formData = new FormData();
        formData.append('bio', data.bio);
        formData.append('experience', data.experience);
        formData.append('phone', data.phone);
        formData.append('availability', data.availability);

        if (data.photo) {
            const uri = data.photo.startsWith('file://') ? data.photo : 'file://' + data.photo;
            const filename = uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            formData.append('profile_photo', { uri, name: filename, type } as any);
        }

        return api('/profiles', {
            method: 'POST',
            body: formData,
        });
    },

    update: async (id: number, data: Partial<ProfileData>) => {
        const formData = new FormData();
        if (data.bio) formData.append('bio', data.bio);
        if (data.experience) formData.append('experience', data.experience);
        if (data.phone) formData.append('phone', data.phone);
        if (data.availability) formData.append('availability', data.availability);

        if (data.photo) {
            const uri = data.photo.startsWith('file://') ? data.photo : 'file://' + data.photo;
            const filename = uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            formData.append('profile_photo', { uri, name: filename, type } as any);
        }

        return api(`/profiles/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: async (id: number) => {
        return api(`/profiles/${id}`, {
            method: 'DELETE',
        });
    },
};





// import {api} from './api';
//
// type SitterProfileData = {
//     bio: string;
//     experience: string;
//     phone: string;
//     availability: string;
//     photo?: string | null;
// };
//
// export const profiles = {
//     create: async (data: SitterProfileData) => {
//         const formData = new FormData();
//
//         formData.append('bio', data.bio);
//         formData.append('experience', data.experience);
//         formData.append('phone', data.phone);
//         formData.append('availability', data.availability);
//
//         if (data.photo) {
//             const uri = data.photo.startsWith('file://') ? data.photo : 'file://' + data.photo;
//             const filename = uri.split('/').pop() || 'photo.jpg';
//             const match = /\.(\w+)$/.exec(filename);
//             const type = match ? `image/${match[1]}` : 'image/jpeg';
//
//             formData.append('profile_photo', { uri, name: filename, type } as any);
//         }
//
//         return api('/profiles', {
//             method: 'POST',
//             body: formData,
//         });
//     },
// };
