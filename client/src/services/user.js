import { fetcher } from "@/lib/fetcher";

export const userService = {
    profile: () => fetcher('/users/profile'),

    userData: (userId) => fetcher(`/users/${userId}`),
}