import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { UserData, users } from "../services/users";

export const useUsers = () => {
    const getUsers = useApiQuery<UserData[]>({
        key: "users",
        endpoint: "/users",
    });

    const getUser = (id: number) =>
        useApiQuery<UserData>({
            key: ["users", id],
            endpoint: `/users/${id}`,
        });

    const createUser = useApiMutation<UserData, UserData>({
        endpoint: "/users",
        method: "POST",
        options: { mutationFn: (data) => users.create(data) },
    });

    const updateUser = useApiMutation<UserData, { id: number; data: Partial<UserData> }>({
        endpoint: "/users",
        method: "PUT",
        options: { mutationFn: ({ id, data }) => users.update(id, data) },
    });

    const deleteUser = useApiMutation<void, number>({
        endpoint: "/users",
        method: "DELETE",
        options: { mutationFn: (id) => users.delete(id) },
    });

    return { getUsers, getUser, createUser, updateUser, deleteUser };
};
