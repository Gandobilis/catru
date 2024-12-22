const routes = [
    {
        path: '/',
        component: () => import('/src/views/AgreementModule.vue'),
    },
    {
        path: '/verify',
        component: () => import('/src/views/Verify.vue'),
    },
    {
        path: '/confirm-sms',
        component: () => import('/src/views/Confirm.vue'),
    },
    {
        path: '/login',
        component: () => import('/src/views/Login.vue'),
    },
    {
        path: '/success',
        component: () => import('/src/views/Success.vue'),
    },
    {
        path: '/filter',
        component: () => import('/src/views/Filters.vue'),
    }
]

export default routes;
