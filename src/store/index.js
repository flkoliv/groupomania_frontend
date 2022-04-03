import { createStore, storeKey } from 'vuex';

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/'
});


let user = localStorage.getItem('user');
if (!user) {
    user = {
        userId: -1,
        token: '',
    };
} else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common['Authorization'] = "Bearer " + user.token;
    } catch (ex) {
        user = {
            userId: -1,
            token: '',
        };
    }

}

const store = createStore({
    state: {
        status: '',
        user: user,
        posts:{},
        userInfos: {
            firstname: '',
            lastname: '',
            email: '',
            photo: '',
        },
    },
    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },
        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = "Bearer " + user.token;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
        },
        logout: function (state) {
            state.user = {
                userId: -1,
                token: '',
            }
            localStorage.removeItem('user');
        },
        posts: function (state, posts) {
            state.posts = posts;
        },
    },
    actions: {

        login: ({ commit }, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('users/login', userInfos)
                    .then(function (response) {
                        commit('logUser', response.data);
                        commit('setStatus', '');
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_login');
                        reject(error);
                    })
            });

        },

        createAccount: ({ commit }, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('users/signup', userInfos)
                    .then(function (response) {
                        commit('setStatus', 'created');
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_create');
                        reject(error);
                    })
            });

        },
        getUserInfos: ({ commit }) => {
            instance.get('users/me')
                .then(function (response) {
                    commit('userInfos', response.data);
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        deleteUser: ({ commit }) => {
            instance.delete('users/me')
                .then(function (response) {
                    console.log(response.data)
                    commit('userInfos', response.data);

                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        updateUser: ({ commit }, data) => {
            console.log(data)
            instance.put('users/me', data)
                .then(function (response) {
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        createPost: ({ commit }, data) => {
            //instance.defaults.headers.common['Content-Type'] = "multipart/form-data";
            return new Promise((resolve, reject) => {
                instance.post('posts', data)
                    .then(function (response) {
                        commit('setStatus', 'created');
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_create');
                        reject(error);
                    })
            });
        },
        getAllPosts: ({ commit }) => {
            instance.get('posts') 
                .then(function (response) {
                    commit('posts', response.data);
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },



    }
})

export default store;