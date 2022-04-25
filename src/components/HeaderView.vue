<template>
  <header
    class="
      fixed
      flex flex-col
      md:flex-row
      content-center
      justify-between
      items-center
      bg-white
      w-full
      shadow-xl
    "
  >
    <img
      src="../assets/icon-left-font.png"
      alt=""
      class="w-80 h-24 object-cover"
    />
    <h1 class="text-5xl font-bold">{{title}}</h1>
    <nav class="md:mr-10">
      <router-link to="/feed">Feed</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/" @click="logout()">Logout</router-link>
    </nav>
    <router-view />
  </header>
  <div class="md:h-32 h-48"></div>
</template>

<script>
export default {
  name: "HeaderView",
  props:{
      title: String
  },
  methods: {
    logout: function () {
      // deconnexion
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
</script>
