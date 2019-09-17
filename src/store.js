import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import swal from 'sweetalert2'
import router from './router';

Vue.use(Vuex)

const questionApi = axios.create({
  baseURL: '//localhost:3000/api/questions',
  timeout: 5000
})
const quizApi = axios.create({
  baseURL: '//localhost:3000/api/quizzes',
  timeout: 5000
})

const categoryApi = axios.create({
  baseURL: '//localhost:3000/api/categories',
  timeout: 5000
})


export default new Vuex.Store({
  state: {
    searchResults: [],
    quizzes: [],
    activeQuiz: {},
    grade: {},
    categories: []
  },

  mutations: {
    removeQuestion(state, id) {
      let deleted = state.searchResults.find(q => q._id == id)
      let index = state.searchResults.indexOf(deleted)
      state.searchResults.splice(index, 1)
    },
    setSearchResults(state, data) {
      state.searchResults = data
    },
    setQuizzes(state, data) {
      state.quizzes = data
    },
    setActiveQuiz(state, data) {
      state.activeQuiz = data
    },
    setGrade(state, data) {
      state.grade = data
    },
    removeQuiz(state, id) {
      let deleted = state.quizzes.find(q => q._id == id)
      let index = state.quizzes.indexOf(deleted)
      state.quizzes.splice(index, 1)
    },
    setCategories(state, categories) {
      state.categories = categories
    }
  },

  actions: {
    getQuestions({ commit, dispatch }) {
      try {
        questionApi.get('')
          .then(res => {
            commit("setSearchResults", res.data)
          })
      } catch (error) {
        console.error(error)
      }
    },
    gradeQuestion({ commit, dispatch }, payload) {
      try {
        questionApi.post(`${payload.question._id}/answers`, payload)
          .then(res => {
            commit('setGrade', res.data)
            payload.alert()
          })
      } catch (error) {
        console.error(error)
      }
    },
    createQuestion({ commit, dispatch }, payload) {
      try {
        questionApi.post('', payload)
          .then(res => {
            dispatch('getQuestions')
          })
      } catch (error) {
        console.error(error)
      }
    },
    searchQuestions({ commit, dispatch }, payload) {
      try {
        questionApi.put('', payload)
          .then(res => {
            commit('setSearchResults', res.data)
          })
      } catch (error) {
        console.error(error)
      }
    },
    deleteQuestion({ commit, dispatch }, payload) {
      try {
        questionApi.delete(payload)
          .then(res => {
            commit('removeQuestion', payload)
          })
      } catch (error) {
        console.error(error)
      }
    },
    //#endregion 
    //#region Quizzes
    createQuiz({ commit, dispatch }, payload) {
      try {
        quizApi.post('', payload.quiz)
          .then(res => {
            commit('setActiveQuiz', {})
            payload.alert()
          })
      } catch (error) {
        console.error(error)
      }
    },
    getActiveQuiz({ commit, dispatch }, id) {
      try {
        quizApi.get(id).then(res => {
          commit('setActiveQuiz', res.data)
        })
      } catch (error) {
        console.error(error)
      }
    },
    getQuizzes({ commit, dispatch }) {
      try {
        quizApi.get('')
          .then(res => {
            commit('setQuizzes', res.data)
          })
      } catch (error) {
        console.error(error)
      }
    },
    async  editQuiz({ commit, dispatch }, payload) {
      try {
        let editedQuiz = await quizApi.put(payload.quiz._id, payload.quiz)
        payload.alert()
        commit('setActiveQuiz', {})
        router.push({ name: "SelectQuiz" })
      } catch (error) {
        console.error(error)
      }
    },
    deleteQuiz({ commit, dispatch }, payload) {
      try {
        quizApi.delete(payload)
          .then(res => {
            commit('removeQuiz', payload)
            dispatch('deleteAlert')
          })
      } catch (error) {
        console.error(error)
      }
    },
    //#endregion 
    //#region Categories
    getCategories({ commit, dispatch }) {
      try {
        categoryApi.get('')
          .then(res => {
            commit('setCategories', res.data)
          })
      } catch (error) {
        console.error(error)
      }
    },
    async createCategory({ commit, dispatch }, payload) {
      try {
        categoryApi.post('', payload.newCategory)
          .then(res => {
            payload.alert()
            dispatch('getCategories')
          })
      } catch (error) {
        console.error(error)
      }
    },
    async deleteCategory({ commit, dispatch }, payload) {
      try {
        categoryApi.delete(payload)
          .then(res => {
            payload.alert()
            dispatch('getCategories')
          })
      } catch (error) {
        console.error(error)
      }
    },
    deleteAlert() {
      swal.fire({
        title: 'Deleted!',
        text: 'Successfully Deleted!',
        confirmButtonColor: '#9c27b0',
        type: 'success'
      })
    }
  }

})

