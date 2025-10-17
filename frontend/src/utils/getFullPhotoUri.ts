import { BASE_URL } from "@env";

export const getFullPhotoUri = (profilePhoto?: string | null) => {
    if (!profilePhoto) return undefined;
    return `${BASE_URL.replace(/\/api$/, "")}${profilePhoto}`;
};
