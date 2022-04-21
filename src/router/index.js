import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile.vue';
import Feed from '@/views/Feed.vue';
import Post from '@/views/PagePost.vue';


const routes = [
    {
        name: 'Home',
        path: '/',
        component: Home,
    }, {
        name: 'Profile',
        path: '/profile',
        component: Profile,
    }, {
        name: 'Feed',
        path: '/feed',
        component: Feed,
    }, {
        name: 'Post',
        path: '/Post/:postId',
        component: Post,
        props: true,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;