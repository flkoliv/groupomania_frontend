<template>
  <div class="flex content-center justify-center items-center h-full">
    <div class="bg-white shadow-xl max-w-lg w-96 rounded-3xl ">
      <img
        class="w-full h-48 object-cover rounded-3xl"
        src="../assets/icon-above-font.svg"
        alt="logo groupomania"
      />

      <h1 v-if="mode == 'login'" class="text-2xl font-bold">Connexion</h1>
      <h1 v-else class="text-2xl font-bold">Inscription</h1>
      <p v-if="mode == 'login'">
        Tu n'as pas encore de compte ?
        <span @click="switchToCreateAccount()" class="underline cursor-pointer"
          >Créer un compte
        </span>
      </p>
      <p v-else>
        Tu as déjà un compte ?
        <span @click="switchToLogin()" class="underline cursor-pointer">
          Se connecter
        </span>
      </p>
      <div class="my-5">
        <div v-if="mode == 'create'" class="my-2">
          <input
            v-model="firstname"
            type="text"
            id="firstname"
            placeholder="Prénom"
            class="rounded border shadow-inner py-2 px-3 mx-2 w-2/3"
          />
        </div>
        <div v-if="mode == 'create'" class="my-2">
          <input
            v-model="lastname"
            type="text"
            id="lastname"
            placeholder="Nom"
            class="rounded border shadow-inner py-2 px-3 w-2/3"
          />
        </div>
        <div class="my-2">
          <input
            v-model="email"
            type="text"
            id="email"
            placeholder="Email"
            class="rounded border shadow-inner py-2 px-3 w-2/3"
          />
        </div>
        <div class="my-2">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Mot de passe"
            class="rounded border shadow-inner py-2 px-3 w-2/3"
          />
        </div>
        <div v-if="mode == 'login' && status == 'error_login'">
          Adresse email et/ou mot de passe invalide
        </div>
        <div v-if="mode == 'create' && status == 'error_create'">
          Email déja utilisé
        </div>
        <div>
          <button
            @click="login()"
            class="py-2 px-3 bg-red-500 text-white hover:bg-red-600 rounded-xl mt-5 w-3/5 shadow"
            :disabled="!validatedFields"
            :class="{ 'cursor-not-allowed': !validatedFields }"
            v-if="mode == 'login'"
          >
            <span v-if="status == 'loading'">Connexion en cours</span>
            <span v-else>Connexion</span>
          </button>
          <button
            @click="createAccount()"
            class="py-2 px-3 bg-red-500 text-white hover:bg-red-600 rounded-xl mt-5 w-3/5"
            :disabled="!validatedFields"
            :class="{ 'cursor-not-allowed': !validatedFields }"
            v-else
          >
            <span v-if="status == 'loading'">Création en cours</span>
            <span v-else>Créer mon compte</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  name: "LoginPage",
  data: function () {
    return {
      mode: "login",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    };
  },
  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/feed");
      return;
    }
  },
  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        if (
          this.email != "" &&
          this.firstname != "" &&
          this.lastname != "" &&
          this.password != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(
          function (response) {
            console.log(response);
            self.$router.push("/feed");
          },
          function (error) {
            console.log(error);
          }
        );
    },
    createAccount: function () {
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          password: this.password,
        })
        .then(
          function (response) {
            console.log(response);
            self.login();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>
