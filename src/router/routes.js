const routes = [
    {
        path: '/',
        component: () => import('/src/views/AgreementModule.vue'),
    },
    {
        path: '/uuid/:uuid',
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
    },
    {
        path: '/not-found',
        component: () => import('/src/views/errorPage.vue'),
    },
    // Catch-all route for 404
    {
        path: '/:catchAll(.*)',
        redirect: '/not-found',
    }
];

export default routes;
