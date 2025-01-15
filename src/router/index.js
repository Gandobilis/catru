import {createRouter, createWebHistory} from 'vue-router';
import routes from "./routes";
import axiosInstance from "/src/interceptors/axios/index.js";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            await axiosInstance.get('get-session', {
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