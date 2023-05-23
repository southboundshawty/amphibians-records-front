import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/release-list',
  },
  {
    path: '/promotion-list',
    name: 'PromotionList',
    component: () => import('../views/PromotionList.vue'),

  },
  {
    path: '/promotion-link/:id',
    name: 'PromotionLink',
    component: () => import('../views/PromotionLink.vue'),
    props: true,
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('../views/Contacts.vue'),
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/Purchase.vue'),
  },
  {
    path: '/moderation-list',
    name: 'ModerationList',
    component: () => import('../views/ModerationList.vue'),
  },
  {
    path: '/release-list',
    name: 'ReleaseList',
    component: () => import('../views/ReleaseList.vue'),
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
  },
  {
    path: '/create_release',
    name: 'CreateRealese',
    component: () => import('../views/CreateRealese.vue'),
  },
  {
    path: '/edit_draft_release/:id',
    name: 'EditDraftRelease',
    component: () => import('../views/CreateRealese.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
