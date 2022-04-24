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
    <h1 class="text-5xl font-bold">Post</h1>
    <nav class="md:mr-10">
      <router-link to="/feed">Feed</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/" @click="logout()">Logout</router-link>
    </nav>
    <router-view />
  </header>
  <div class="md:h-32 h-48"></div>

  <div class="px-5 w-full flex flex-col justify-center items-center">
    <div
      class="
        flex flex-col
        bg-white
        mt-5
        w-full
        md:w-3/5
        rounded-xl
        shadow-xl
        overflow-hidden
      "
    >
      <h2 class="text-3xl font-bold">{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <p v-if="post.user">{{ post.user.firstname }} {{ post.user.lastname }}</p>
      <img :src="post.imageUrl" alt="" />
    </div>
    <div
      class="
        flex-col
        md:flex md:flex-row
        items-center
        justify-around
        bg-white
        m-5
        md:w-3/5
        w-full
        rounded-xl
        shadow-xl
        p-5
      "
    >
      <textarea
        v-model="comment"
        class="md:w-1/3 w-full border shadow-inner px-3 py-2"
        placeholder="Votre texte"
      ></textarea>
      <button
        class="
          py-2
          px-2
          bg-red-500
          text-white
          hover:bg-red-600
          rounded-xl
          shadow-lg
          uppercase
          w-full
          md:w-1/3
        "
        @click="createComment()"
        :disabled="!validatedFields"
        :class="{ 'cursor-not-allowed': !validatedFields }"
      >
        Nouveau commentaire
      </button>
    </div>

    <div
      class="bg-white mt-5 w-full md:w-3/5 rounded-xl shadow-xl"
      v-for="comment in post.comments"
      :key="comment"
    >
      <p>{{ comment.comment }}</p>
      <p>Auteur : {{ comment.user.firstname }} {{ comment.user.lastname }}</p>
      <i
        v-if="comment.userId == userId || user.admin"
        @click="deleteComment(comment.id)"
        class="cursor-pointer fas fa-ban"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "PagePost",
  props: ["postId"],
  data() {
    return {
      post: this.$store.state.post,
      userId: 0,
      comment: "",
      user: this.$store.state.userInfos,
    };
  },

  computed: {
    validatedFields: function () {
      if (this.comment != "") {
        return true;
      } else {
        return false;
      }
    },
  },

  beforeMount: function () {
    const postId = this.$route.params.postId;
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    const self = this;
    this.$store.dispatch("getUserInfos");
    this.$store.dispatch("getOnePost", postId).then(
      function () {
        self.post = self.$store.state.post;
      },
      function (error) {
        console.log(error);
        self.$router.push("/");
      }
    );
    this.userId = this.$store.state.user.userId;
  },
  methods: {
    logout: function () {
      // deconnexion
      this.$store.commit("logout");
      this.$router.push("/");
    },
    createComment: function () {
      //créer un commentaire
      const self = this;
      this.$store
        .dispatch("createComment", {
          comment: this.comment,
          userId: this.userId,
          postId: this.post.id,
        })
        .then(
          function (response) {
            self.post.comments.push({
              id: response.data.result.id,
              comment: self.comment,
              userId: self.userId,
              postId: self.post.id,
              user: {
                firstname: self.$store.state.userInfos.firstname,
                lastname: self.$store.state.userInfos.lastname,
              },
            });
            self.comment = "";
          },
          function (error) {
            console.log(error);
            self.$router.push("/");
          }
        );
    },

    deleteComment(id) {
      // supprimer un commentaire
      const self = this;
      this.$store
        .dispatch("deleteComment", {
          userId: this.userId,
          id: id,
        })
        .then(
          function () {
            const comments = self.post.comments;
            for (var i in comments) {
              if (comments[i].id == id) {
                comments.splice(i, 1);
              }
            }
          },
          function (error) {
            console.log(error);
            self.$router.push("/");
          }
        );
    },
  },
};
</script>

<style>
</style>