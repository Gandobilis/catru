import {createRouter, createWebHistory} from 'vue-router';
import routes from "./routes";
import axios from "axios";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}get-session`, {
                withCredentials: true,
            });
            next();
        } catch (e) {
            next({name: 'Login'});
        }
    } else {
        next();
    }
});

export default router;