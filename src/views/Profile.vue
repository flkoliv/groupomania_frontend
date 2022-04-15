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
    <h1 class="text-5xl font-bold">Profile</h1>
    <nav class="md:mr-10">
      <router-link to="/feed">Feed</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/" @click="logout()">Logout</router-link>
    </nav>
    <router-view />
  </header>
  <div class="md:h-32 h-48"></div>

  <input type="text" v-model="firstname" />
  <input type="text" v-model="lastname" />
  <input type="text" v-model="email" />
  <button @click="updateUser()">Modifier</button>
  <button @click="deleteUser()">Supprimer</button>
  
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  beforeMount: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    const self = this;
    this.$store.dispatch("getUserInfos").then(
      function (response) {
        console.log(response);
        self.firstname = self.$store.state.userInfos.firstname;
        self.lastname = self.$store.state.userInfos.lastname;
        self.email = self.$store.state.userInfos.email;
      },
      function (error) {
        console.log(error);
      }
    );
  },
  
  data() {
    return {
      firstname: "",
      lastname: "",
      email: "",
    };
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    deleteUser: function () {
      this.$store.dispatch("deleteUser");
      this.$store.commit("logout");
      this.$router.push("/");
    },
    updateUser: function () {
      this.$store.dispatch("updateUser", {
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
      });
    },
  },
};
</script>
