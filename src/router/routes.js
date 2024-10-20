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
    }
]

export default routes;
