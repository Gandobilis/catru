import {ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import cookies from "vue-cookies"

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
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}login`, {
                    username: user.value.username,
                    user_id: response.user_id
                }, {
                    withCredentials: true
                });

               // await router.push("/");
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