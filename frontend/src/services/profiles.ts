import { api } from './api';

type SitterProfileData = {
    bio: string;
    experience: string;
    phone: string;
    availability: string;
    profilePhoto?: string | null;
};

export const profiles = {
    getAll: () => api('/profiles'),
    get: (id: number) => api(`/profiles/${id}`),
    create: async (data: SitterProfileData) => {
        const formData = new FormData();

        formData.append('bio', data.bio);
        formData.append('experience', data.experience);
        formData.append('phone', data.phone);
        formData.append('availability', data.availability);

        if (data.profilePhoto) {
            const uri = data.profilePhoto.startsWith('file://') ? data.profilePhoto : 'file://' + data.profilePhoto;
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
    update: async (id: number, data: SitterProfileData) => {
        const formData = new FormData();
        formData.append("_method", "PUT");

        if (data.bio) formData.append("bio", data.bio);
        if (data.experience) formData.append("experience", data.experience);
        if (data.phone) formData.append("phone", data.phone);
        if (data.availability) formData.append("availability", data.availability);

        if (data.profilePhoto) {
            const uri = data.profilePhoto;
            const filename = uri.split("/").pop() || "profile.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            formData.append("profile_photo", {
                uri,
                name: filename,
                type,
            } as any);
        }
        console.log("Profile photo URI:", data.profilePhoto);


        for (const key in formData as any) {
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                console.log(key, (formData as any)[key]);
            }
        }

        const response = await api(`/profiles/${id}`, {
            method: "POST",
            body: formData,
        });

        console.log("🟩 Update response:", response);
        return response;
    },
    delete: (id: number) => api(`/profiles/${id}`, { method: 'DELETE' }),
};




// import { api } from './api';
// import {BASE_URL} from "@env";
//
// type SitterProfileData = {
//     bio: string;
//     experience: string;
//     phone: string;
//     availability: string;
//     profilePhoto?: string | null;
// };
//
// export const profiles = {
//     getAll: () => api('/profiles'),
//     get: (id: number) => api(`/profiles/${id}`),
//     create: async (data: SitterProfileData) => {
//         const formData = new FormData();
//
//         formData.append('bio', data.bio);
//         formData.append('experience', data.experience);
//         formData.append('phone', data.phone);
//         formData.append('availability', data.availability);
//
//         if (data.profilePhoto) {
//             const uri = data.profilePhoto.startsWith('file://') ? data.profilePhoto : 'file://' + data.profilePhoto;
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
//     update: async (id: number, data: Partial<SitterProfileData>, token: string) => {
//         const formData = new FormData();
//
//         formData.append('_method', 'PUT');
//
//         if (data.bio) formData.append('bio', data.bio);
//         if (data.experience) formData.append('experience', data.experience);
//         if (data.phone) formData.append('phone', data.phone);
//         if (data.availability) formData.append('availability', data.availability);
//
//         if (data.profilePhoto) {
//             const uri = data.profilePhoto.startsWith('file://') ? data.profilePhoto : 'file://' + data.profilePhoto;
//             const filename = uri.split('/').pop() || 'photo.jpg';
//             const match = /\.(\w+)$/.exec(filename);
//             const type = match ? `image/${match[1]}` : 'image/jpeg';
//             formData.append('profile_photo', { uri, name: filename, type } as any);
//         }
//
//         console.log('🟦 Sending profile update:', { id, data });
//
//         const response = await api(`/profiles/${id}`, {
//             method: 'POST',
//             body: formData,
//         });
//
//         const json = await response.json();
//         console.log('🟩 Update response:', json);
//         return json;
//     },
//     delete: (id: number) => api(`/profiles/${id}`, { method: 'DELETE' }),
// };
