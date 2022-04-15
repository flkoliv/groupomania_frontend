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

  <div class="w-full flex flex-col justify-center items-center">
    <div
      class="
        flex flex-col
        bg-white
        mt-5
        w-3/5
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
        flex
        items-center
        justify-around
        bg-white
        mt-5
        w-3/5
        rounded-xl
        shadow-xl
        p-5
      "
    >
      <textarea
        v-model="comment"
        class="border shadow-inner px-3 py-2"
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
          w-52
        "
        @click="createComment()"
      >
        Nouveau commentaire
      </button>
    </div>

    <div
      class="bg-white mt-5 w-3/5 rounded-xl shadow-xl"
      v-for="comment in post.comments"
      :key="comment"
    >
      <p>{{ comment.comment }}</p>
      <p>Auteur : {{ comment.user.firstname }} {{ comment.user.lastname }}</p>
      <i
        v-if="comment.userId == userId"
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
    };
  },
  beforeMount: function () {
    const postId = this.$route.params.postId;
    if (postId == "") {
      this.$router.push("/");
    }
    const self = this;
    this.$store.dispatch("getOnePost", postId).then(
      function (response) {
        console.log(response.data);
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
      this.$store.commit("logout");
      this.$router.push("/");
    },
    createComment: function () {
      const self = this;
      this.$store
        .dispatch("createComment", {
          comment: this.comment,
          userId: this.userId,
          postId: this.post.id,
        })
        .then(
          function (response) {
            console.log(response.data);
            self.$router.go();
          },
          function (error) {
            console.log(error);
            self.$router.push("/");
          }
        );
    },

    deleteComment(id) {
      console.log(id);
      const self = this;
      this.$store
        .dispatch("deleteComment", {
          userId: this.userId,
          id: id,
        })
        .then(
          function (response) {
            console.log(response.data);
            self.$router.go();
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