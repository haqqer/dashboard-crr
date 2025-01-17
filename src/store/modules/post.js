import $axios from '../../api'

const state = () => ({
  posts: [],
})

const mutations = {
  ASSIGN_DATA(state, payload){
    state.posts = payload
  }
}

const actions = {
  getAllPost({commit}){
    //let search = typeof payload != 'undefined' ? payload:''
    return new Promise((resolve) => {
      $axios.get(`posts`)
      .then((response) => {
        // console.log(response.data.result)
        commit('ASSIGN_DATA', response.data.result)
        resolve(response.data)
      })
    })
  }, 
  getAllPostById({commit}, payload){
    return new Promise((resolve) => {
      $axios.get(`/posts?project_id=${payload}`)
      .then((response) => {
        commit('ASSIGN_DATA', response.data.result)
        resolve(response.data)
      })
    })
  },
  addPost({dispatch}, payload){
    return new Promise((resolve) => {
      $axios.post(`/posts`, payload)
      .then((response) => {
        dispatch('getAllPost').then(() => {
          resolve(response.data)
        })
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}