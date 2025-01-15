import {ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import cookies from "vue-cookies"
import axiosInstance from "../interceptors/axios/index.js";

export default function useAuth() {
    const user = ref({
        username: undefined,
        password: undefined,
    });
    const authError = ref();
    const router = useRouter();

    const login = async () => {
        authError.value = null;

        if (!user.value.username || !user.value.password) {
            authError.value = "გთხოვთ შეავსოთ მონაცემები.";
            return;
        }

        // ავტორიზაციის რექვესთი

        const response = {
            message: "Allow",
            user_id: 1,
        };

        cookies.set("user_id", response.user_id);

        if (response.message === "Allow") {
            try {
                await axiosInstance.post(`login`, {
                    username: user.value.username,
                    user_id: response.user_id
                });

                await router.push("/");
            } catch (e) {
                authError.value = "სერვერზე დაფიქსირდა შეცდომა.";
            }
        } else if (response.message === "Reject") {
            authError.value = "მომხმარებლის მონაცემები არასწორია.";
        } else {
            authError.value = "სერვერზე დაფიქსირდა შეცდომა.";
        }
    };

    return {
        user, authError, login
    };
};