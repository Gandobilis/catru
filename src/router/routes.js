const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {requiresAuth: true},
        component: () => import('/src/views/AgreementModule.vue'),
    },
    {
        path: '/uuid/:uuid',
        name: 'UUID',
        meta: {requiresAuth: false},
        component: () => import('/src/views/Verify.vue'),
    },
    {
        path: '/confirm-sms/:uuid',
        name: 'ConfirmSms',
        meta: {requiresAuth: false},
        component: () => import('/src/views/Confirm.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        meta: {requiresAuth: false},
        component: () => import('/src/views/Login.vue'),
    },
    {
        path: '/success',
        name: 'Success',
        meta: {requiresAuth: false},
        component: () => import('/src/views/Success.vue'),
    },
    {
        path: '/filter',
        name: 'Filter',
        meta: {requiresAuth: true},
        component: () => import('/src/views/Filters.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        meta: {requiresAuth: false},
        component: () => import('/src/views/NotFound.vue'),
    },
];

export default routes;
