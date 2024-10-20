const routes = [
    {
        path: '/',
        component: () => import('/src/views/AgreementModule.vue'),
    },
    {
        path: '/verify',
        component: () => import('/src/views/Verify.vue'),
    }
]

export default routes;