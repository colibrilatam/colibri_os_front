import { fetcher } from "@/lib/fetcher";

export const userService = {
    profile: () => fetcher('/users/profile'),
}