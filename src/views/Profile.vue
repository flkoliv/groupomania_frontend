<template>
  <h1>Profile</h1>
  <nav>
    <router-link to="/feed">Feed</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to @click="logout()">Logout</router-link>
  </nav>
  <input type="text" v-model="firstname" />
  <input type="text" v-model="lastname" />
  <input type="text" v-model="email" />
  <button @click="updateUser()">Modifier</button>
  <button @click="deleteUser()">Supprimer</button>
  <button @click="logout()">Deconnexion</button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  beforeMount: async function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    await this.$store.dispatch("getUserInfos")
    this.firstname = this.$store.state.userInfos.firstname;
    this.lastname = this.$store.state.userInfos.lastname;
    this.email = this.$store.state.userInfos.email;
  },
  mounted: function () {
    // if (this.$store.state.user.userId == -1) {
    //   this.$router.push("/");
    //   return;
    // }
    // this.$store.dispatch("getUserInfos");
    
  },
  data (){
    return {
      firstname: this.$store.state.userInfos.firstname ?? '',
      lastname:'',
      email:'',
    }
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
