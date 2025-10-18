import * as SecureStore from "expo-secure-store";
import {BASE_URL} from "@env";

export const api = async (endpoint: string, options: RequestInit = {}) => {
    const token = await SecureStore.getItemAsync("token");
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw data || { message: `Request failed with status ${res.status}` };

    return data;
};
