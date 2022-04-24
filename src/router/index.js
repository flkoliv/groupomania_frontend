import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import Feed from "@/views/FeedPage.vue";
import Post from "@/views/PagePost.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home,
  },
  {
    name: "Profile",
    path: "/profile",
    component: Profile,
  },
  {
    name: "FeedPage",
    path: "/feed",
    component: Feed,
  },
  {
    name: "Post",
    path: "/Post/:postId",
    component: Post,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// navigation guard
router.beforeEach(async (to) => {
  let user = localStorage.getItem("user");
  if (user == null && to.name !== "Home") {
    return { name: "Home" };
  }
});

export default router;
