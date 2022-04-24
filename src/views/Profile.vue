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

  <div class="flex justify-center">
    <div
      class="flex flex-col md:w-96 w-full bg-white shadow-xl rounded-xl p-5 m-4"
    >
      <div class="flex items-center m-2 justify-between">
        <p>Prénom</p>
        <input
          type="text"
          class="rounded border shadow-inner py-2 px-3 w-2/3"
          v-model="firstname"
        />
      </div>
      <div class="flex items-center m-2 justify-between">
        <p>Nom</p>
        <input
          type="text"
          class="rounded border shadow-inner py-2 px-3 w-2/3"
          v-model="lastname"
        />
      </div>
      <div class="flex items-center m-2 justify-between">
        <p>Email</p>
        <input
          type="text"
          class="rounded border shadow-inner py-2 px-3 w-2/3"
          v-model="email"
        />
      </div>
      <div
        class="flex items-center md:flex md:justify-around md:flex-row flex-col"
      >
        <button
          :disabled="!validatedFields"
          :class="{ 'cursor-not-allowed': !validatedFields }"
          class="
            m-3
            py-2
            px-2
            bg-red-500
            text-white
            hover:bg-red-600
            rounded-xl
            shadow-lg
            uppercase
            md:w-52
            w-4/5
          "
          @click="updateUser()"
        >
          Modifier
        </button>
        <button
          class="
            m-3
            py-2
            px-2
            bg-red-500
            text-white
            hover:bg-red-600
            rounded-xl
            shadow-lg
            uppercase
            md:w-52
            w-4/5
          "
          @click="deleteUser()"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProfilePage",
  beforeMount: function () {
    if (this.$store.state.user.userId == -1) {
      // si utilisateur non connecté
      this.$router.push("/");
      return;
    }
    const self = this;
    this.$store.dispatch("getUserInfos").then(
      function () {
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
    validatedFields: function () {
      // vérifier si les champs sont remplis
      if (this.firstname != "" && this.lastname != "" && this.email != "") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    logout: function () {
      // deconnexion
      this.$store.commit("logout");
      this.$router.push("/");
    },
    deleteUser: function () {
      // supression utilisateur
      this.$store.dispatch("deleteUser");
      this.$store.commit("logout");
      this.$router.push("/");
    },
    updateUser: function () {
      this.$store.dispatch("updateUser", {
        // modification utilisateur
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
      });
    },
  },
};
</script>
