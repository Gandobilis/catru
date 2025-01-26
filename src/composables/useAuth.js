import {ref} from "vue";
import {useRouter} from "vue-router";
import axiosInstance from "/src/interceptors/axios/index.js";

export default function useAuth() {
    const router = useRouter();

    const user = ref({
        username: '',
        password: '',
    });

    const authError = ref();

    const login = async () => {
        authError.value = null;

        if (!user.value.username.trim() || !user.value.password.trim()) {
            authError.value = "გთხოვთ შეავსოთ მონაცემები.";
            return;
        }

        try {
            await axiosInstance.post(`login`, {
                username: user.value.username,
                password: user.value.password,
            });

            await router.push("/");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                authError.value = error.response.data.message;
            } else {
                authError.value = "სერვერზე დაფიქსირდა შეცდომა.";
            }
        }
    };

    return {
        user,
        authError,
        login,
    };
};