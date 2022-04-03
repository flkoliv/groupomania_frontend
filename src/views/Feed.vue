<template>
  <h1>Feed</h1>
  <nav>
    <router-link to="/feed">Feed</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to @click="logout()">Logout</router-link>
  </nav>
  <router-view />
  <input type="text" v-model="title" />
  <textarea v-model="post"></textarea>
  <input type="file" @change="handleFileUpload($event)" />
  <img
    v-if="imagePreview"
    :src="imagePreview"
    id="preview"
    class="newPost__content__image"
    alt="Prévisualisation de l'image ajoutée au message"
  />
  <button @click="createPost()">Nouveau post</button>
  <div v-for="post in posts" :key="post.id">
    
    <button v-if="post.userId == userId">Supprimer</button> / {{ post.title }} /
    {{ post.description }} / <img :src="post.imageUrl" height="100" alt="" />
  </div>
</template>

<script>
export default {
  name: "Feed",
  data() {
    return {
      file: "",
      imagePreview: null,
      posts: this.$store.state.posts,
      userId:0
    };
  },
  beforeMount: function () {
    this.$store.dispatch("getUserInfos");
    this.$store.dispatch("getAllPosts");
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.post = "";
    this.userId = this.$store.state.user.userId;
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    createPost: function () {
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("title", this.title);
      formData.append("description", this.post);
      formData.append("userId", this.$store.state.user.userId);
      this.$store.dispatch("createPost", formData);
      console.log(formData);
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.imagePreview = URL.createObjectURL(this.file);
    },
  },
};
</script>
