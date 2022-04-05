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
    <h1 class="text-5xl font-bold">Feed</h1>
    <nav class="md:mr-10">
      <router-link to="/feed">Feed</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/" @click="logout()">Logout</router-link>
    </nav>
    <router-view />
  </header>

  <div class="md:h-32 h-48"></div>

  <div class="flex justify-center content-between">
    <div class="w-3/5 bg-white rounded-xl shadow-xl my-2 p-5">
      <div class="flex flex-col">
        <input
          type="text"
          v-model="title"
          class="border shadow-inner px-3 py-2 mb-3"
          placeholder="Titre"
        />
        <textarea
          v-model="post"
          class="border shadow-inner px-3 py-2"
          placeholder="Votre texte"
        ></textarea>
      </div>
      <div class="flex justify-around flex-col md:flex-row">
        <div class="flex items-center justify-center bg-grey-lighter">
          <label
            class="
              mt-3
              w-52
              flex flex-col
              items-center
              px-2
              py-2
              bg-white
              text-blue
              rounded-xl
              shadow-lg
              tracking-wide
              uppercase
              border border-blue
              cursor-pointer
              hover:bg-blue hover:text-red-500
            "
          >
            <span class="text-base leading-normal">Choisir un fichier</span>
            <input
              type="file"
              class="hidden"
              @change="handleFileUpload($event)"
            />
          </label>
        </div>

        <div class="flex items-center justify-center">
          <button
            @click="createPost()"
            class="
              mt-3
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
          >
            Nouveau Post
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img
          v-if="imagePreview"
          :src="imagePreview"
          id="preview"
          class="w-24 h-24 object-cover mt-5"
          alt="Prévisualisation de l'image ajoutée au message"
        />
      </div>
    </div>
  </div>
  <div
    v-for="post in posts"
    :key="post.id"
    class="flex content-center justify-center items-center"
  >
    <div
      class="
        bg-white
        my-2
        w-3/5
        rounded-xl
        shadow-xl
        justify-between
        flex
        overflow-hidden
      "
    >
      <div class="w-1/2">
        <button
          v-if="post.userId == userId"
          class="
            py-2
            px-3
            bg-red-500
            text-white
            hover:bg-red-600
            rounded-xl
            mt-2
            w-24
            shadow
          "
        >
          Supprimer
        </button>
        <h1 class="font-bold">{{ post.title }}</h1>
        <p>{{ post.description }}</p>
      </div>
      <img
        v-if="post.imageUrl"
        :src="post.imageUrl"
        height="100"
        alt=""
        class="object-cover w-1/2 max-h-72"
      />
    </div>
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
      userId: 0,
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
