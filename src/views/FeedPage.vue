/* eslint-disable vue/multi-word-component-names */
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
    <div class="md:w-3/5 w-full mx-5 bg-white rounded-xl shadow-xl my-2 p-5">
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
            :disabled="!validatedFields"
            :class="{ 'cursor-not-allowed': !validatedFields }"
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
        rounded-xl
        shadow-xl
        justify-between
        flex
        overflow-hidden
        md:w-3/5
        w-full
        mx-5
      "
    >
      <div class="w-1/2">
        <i
          @click="showPost(post.id)"
          class="cursor-pointer fas fa-comments"
        ></i>
        {{ post.nbComments }}
        <i
          v-if="!post.liked"
          @click="like(post.id)"
          class="cursor-pointer fas fa-heart"
        ></i>
        <i
          v-if="post.liked"
          @click="dislike(post.id)"
          class="text-red-500 cursor-pointer fas fa-heart"
        ></i>
        {{ post.nbLikes }}
        <i
          v-if="post.userId == userId || admin"
          class="text-red-500 hover:text-red-600 fas fa-ban cursor-pointer"
          @click="deletePost(post.id)"
        ></i>
        <h1 class="font-bold">{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <p>{{ post.firstname }} {{ post.lastname }}</p>
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
  name: "FeedPage",
  data() {
    return {
      file: "",
      imagePreview: null,
      posts: {},
      userId: 0,
      post: "",
      title: "",
      admin: false,
    };
  },
  computed: {
    validatedFields: function () {
      if (this.post != "" && this.title != "") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    const self = this;
    this.$store.dispatch("getUserInfos").then(
      function () {
        self.admin = self.$store.state.userInfos.admin;
      },
      function (error) {
        console.log(error);
      }
    );
    this.$store.dispatch("getAllPosts").then(
      function () {
        self.posts = self.$store.state.posts;
      },
      function (error) {
        console.log(error);
      }
    );
    this.userId = this.$store.state.user.userId;
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    createPost: function () {
      let formData = new FormData();
      const self = this;
      formData.append("image", this.file);
      formData.append("title", this.title);
      formData.append("description", this.post);
      formData.append("userId", this.$store.state.user.userId);
      this.$store.dispatch("createPost", formData).then(
        function (response) {
          response.data.result.nbLikes = 0;
          response.data.result.nbComments = 0;
          response.data.result.firstname =
            self.$store.state.userInfos.firstname;
          response.data.result.lastname = self.$store.state.userInfos.lastname;
          self.posts.unshift(response.data.result);
          self.title = "";
          self.post = "";
          self.imagePreview = "";
          self.file = null;
        },
        function (error) {
          console.log(error);
          self.title = "";
          self.post = "";
          self.imagePreview = "";
          self.file = null;
          // self.$router.push("/");
        }
      );
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.imagePreview = URL.createObjectURL(this.file);
    },
    showPost(key) {
      const self = this;
      this.$store.dispatch("getOnePost", key).then(
        function () {
          self.$router.push("/post/" + key);
        },
        function (error) {
          console.log(error);
        }
      );
    },
    deletePost(id) {
      const self = this;
      this.$store
        .dispatch("deletePost", {
          userId: this.userId,
          id: id,
        })
        .then(
          function () {
            const posts = self.posts;
            for (var i in posts) {
              if (posts[i].id == id) {
                posts.splice(i, 1);
              }
            }
            // self.$router.go();
          },
          function (error) {
            console.log(error);
          }
        );
    },
    like(id) {
      const self = this;
      this.$store
        .dispatch("likePost", {
          userId: this.userId,
          postId: id,
        })

        .then(
          function () {
            const posts = self.posts;
            for (var i in posts) {
              if (posts[i].id == id) {
                posts[i].liked = 1;
                posts[i].nbLikes += 1;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        );
    },
    dislike(id) {
      const self = this;
      this.$store
        .dispatch("dislikePost", {
          userId: this.userId,
          postId: id,
        })

        .then(
          function () {
            const posts = self.posts;
            for (var i in posts) {
              if (posts[i].id == id) {
                posts[i].liked = null;
                posts[i].nbLikes -= 1;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>
