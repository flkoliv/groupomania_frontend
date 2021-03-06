import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://127.0.0.1:3000/api/",
});

let user = localStorage.getItem("user");
if (!user) {
  user = {
    userId: -1,
    token: "",
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common["Authorization"] = "Bearer " + user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: "",
    };
  }
}

const store = createStore({
  state: {
    status: "",
    user: user,
    posts: {},
    post: {},
    userInfos: {
      firstname: "",
      lastname: "",
      email: "",
      photo: "",
    },
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      instance.defaults.headers.common["Authorization"] =
        "Bearer " + user.token;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: "",
      };
      localStorage.removeItem("user");
    },
    posts: function (state, posts) {
      state.posts = posts;
    },
    post: function (state, post) {
      state.post = post;
    },
  },
  actions: {
    login: ({ commit }, userInfos) => {
      // connexion utilisateur
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("users/login", userInfos)
          .then(function (response) {
            commit("logUser", response.data);
            commit("setStatus", "");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_login");
            reject(error);
          });
      });
    },

    createAccount: ({ commit }, userInfos) => {
      // création d'un compte utilisateur
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("users/signup", userInfos)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },
    getUserInfos: ({ commit }) => {
      // récupération des infos utilisateur
      return new Promise((resolve, reject) => {
        instance
          .get("users/me")
          .then(function (response) {
            commit("userInfos", response.data);
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },
    deleteUser: ({ commit }) => {
      // supprimer utilisateur
      instance
        .delete("users/me")
        .then(function (response) {
          commit("userInfos", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    updateUser: ({ commit }, data) => {
      // mise à jour utilisateur
      commit;
      instance
        .put("users/me", data)
        .then(function () {})
        .catch(function (error) {
          console.log(error);
        });
    },
    createPost: ({ commit }, data) => {
      // création d'un post
      return new Promise((resolve, reject) => {
        instance
          .post("posts", data)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },
    getAllPosts: ({ commit }) => {
      // récupération de tous les posts
      return new Promise((resolve, reject) => {
        instance
          .get("posts", { params: { userId: 60 } })
          .then(function (response) {
            commit("posts", response.data);
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    getOnePost: ({ commit }, key) => {
      // récupération d'un post en fonction de son id
      return new Promise((resolve, reject) => {
        instance
          .get("posts/" + key)
          .then(function (response) {
            commit("post", response.data);
            resolve(response);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      });
    },

    createComment: ({ commit }, data) => {
      // créer un commentaire
      return new Promise((resolve, reject) => {
        instance
          .post("posts/comment", data)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },

    deleteComment: ({ commit }, data) => {
      // supprimer un commentaire
      commit;
      return new Promise((resolve, reject) => {
        instance
          .delete("posts/comment", { data: data })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },

    deletePost: ({ commit }, data) => {
      // supprimer un post
      commit;
      return new Promise((resolve, reject) => {
        instance
          .delete("posts", { data: data })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },

    likePost: ({ commit }, data) => {
      // ajouter un like
      return new Promise((resolve, reject) => {
        instance
          .post("posts/like", data)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },
    dislikePost: ({ commit }, data) => {
      // enlever un like
      commit;
      return new Promise((resolve, reject) => {
        instance
          .delete("posts/like", { data: data })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
  },
});

export default store;
