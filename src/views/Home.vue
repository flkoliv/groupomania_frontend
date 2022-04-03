<template>
  <img src="../assets/logo.png" alt="logo groupomania" />
  <h1>Groupomania</h1>
  <h2 v-if="mode == 'login'">Connexion</h2>
  <h2 v-else>Inscription</h2>
  <p v-if="mode == 'login'">
    Tu n'as pas encore de compte ?
    <span @click="switchToCreateAccount()">Créer un compte</span>
  </p>
  <p v-else>
    Tu as déjà un compte ?
    <span @click="switchToLogin()">Se connecter</span>
  </p>

  <div v-if="mode == 'create'">
    <label for="firstname">Prénom</label>
    <input v-model="firstname" type="text" id="firstname" />
  </div>
  <div v-if="mode == 'create'">
    <label for="lastname">Nom</label>
    <input v-model="lastname" type="text" id="lastname" />
  </div>
  <div>
    <label for="email">Email</label>
    <input v-model="email" type="text" id="email" />
  </div>
  <div>
    <label for="password">Mot de passe</label>
    <input v-model="password" type="password" id="password" />
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
      class="button"
      :class="{ 'button--disabled': !validatedFields }"
      v-if="mode == 'login'"
    >
      <span v-if="status == 'loading'">Connexion en cours</span>
      <span v-else>Connexion</span>
    </button>
    <button
      @click="createAccount()"
      class="button"
      :class="{ 'button--disabled': !validatedFields }"
      v-else
    >
      <span v-if="status == 'loading'">Création en cours</span>
      <span v-else>Créer mon compte</span>
    </button>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  name: "Login",
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
