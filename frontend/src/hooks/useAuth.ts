import { useApiMutation } from "./useApiMutation";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../services/auth";

export const useAuth = () => {
    const getLoggedInUser = useQuery({
        queryKey: ["authUser"],
        queryFn: auth.getLoggedInUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const getToken = useQuery({
        queryKey: ["authToken"],
        queryFn: auth.getToken,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const login = useApiMutation({
        endpoint: "/login",
        method: "POST",
        options: { mutationFn: (data) => auth.login(data) },
    });

    const signup = useApiMutation({
        endpoint: "/register",
        method: "POST",
        options: { mutationFn: (data) => auth.signup(data) },
    });

    const logout = async () => {
        await auth.logout();
    };

    return { login, signup, logout, getLoggedInUser, getToken };
};
