<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <form @submit.prevent="createQuiz">
          <div class="md-card md-theme-default">
            <div class="md-card-header" data-background-color="purple">
              <h3 class="title" style="color: white !important; text-shadow: gray 0px 1px; font-weight: 500;">
                {{activeQuiz._id ? 'Edit Quiz' : 'Create Quiz'}}</h3>
            </div>
            <div class="md-card-content">
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field class="has-danger md-theme-defult">
                    <label>Quiz Title:</label>
                    <md-input v-model="quiz.name"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-field class="has-danger">
                    <label>Topic</label>
                    <md-input v-model="quiz.topic" spellcheck=true required>
                    </md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-xsmall-size-100 md-size-33">
                  <md-field>
                    <label>Difficulty Level</label>
                    <md-select v-model="quiz.difficulty" required>
                      <md-option value="Beginner">Beginner</md-option>
                      <md-option value="Intermediate">Intermediate</md-option>
                      <md-option value="Hard">Hard</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                  <button type="button" @click="selectQuestions = true"
                    class="md-layout-item md-xsmall-size-100 md-size-33 md-alignment-center-center md-button md-raised md-primary">
                    <div class="md-ripple">
                      <div class="md-button-content">View Available Questions</div>
                    </div>
                  </button>
                  <h3>
                    <u>Quiz Questions</u>
                  </h3>
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-33 md-xsmall-size-100 md-alignment-center-center my-2"
                      v-for="(question, index) in quiz.questions">
                      <p>{{index + 1}}. {{question.prompt}}</p>
                      <i class="fas fa-ban fa-lg inline-form mr-2 align-self-center"
                        @click="removeQuizQuestion(index, question)"></i>
                    </div>
                  </div>
                </div>
                <div class="md-layout-item md-size-100 justify-content-center "><button type="submit"
                    class="md-button md-raised md-primary md-theme-default">
                    <div class="md-ripple">
                      <div class="md-button-content">Submit</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <CreateQuestion></CreateQuestion>

    <div v-show="selectQuestions" class="row justify-content-center">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <div class="md-card">
          <div class="md-card-header md-layout" data-background-color="blue">
            <div class="md-layout-item md-size-66 md-xsmall-size-66 text-left my-3">
              <h1 class="md-title" style="color:white !important; text-shadow: gray 0 1px; font-weight: 500;">
                Available Questions</h1>
            </div>
            <div class="md-layout-item md-size-33 md-xsmall-size-33 mt-3 text-right addQuiz hover">
              <i id="addQuizIcon" class="text-white fas fa-lg fa-plus" data-toggle="modal"
                data-target="#questionModal"></i>
              <div id="quizText">
                Add A Question
              </div>
            </div>
          </div>
          <SearchQuestions></SearchQuestions>
          <md-table>
            <md-table-row class="md-layout-item md-size-100 md-xsmall-size-50">
              <md-table-head>Prompt</md-table-head>
              <md-table-head>Type</md-table-head>
              <md-table-head>Category</md-table-head>
              <md-table-head>Add</md-table-head>
              <md-table-head>Delete</md-table-head>
            </md-table-row>
            <md-table-row v-for="question in results" :key="question._id">
              <md-table-cell>{{ question.prompt }}</md-table-cell>
              <md-table-cell>{{ question.type }}</md-table-cell>
              <md-table-cell>{{ prettify(question.categories) }}</md-table-cell>
              <!-- TODO UNWRAP THIS FOR EDITS -->
              <md-table-cell multiple>
                <md-checkbox md-dense v-model="quiz.questions" :value="question">
                </md-checkbox>
              </md-table-cell>
              <md-table-cell>
                <i class="fas fa-ban fa-lg inline-form mr-2 align-self-center"
                  @click="deleteQuestion(question._id)"></i>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateQuestion from '@/components/CreateQuestion.vue'
  import SearchQuestions from '@/components/SearchQuestions.vue'
  import CategoriesComponent from '@/components/CategoriesComponent.vue'
  import delortAlert from '../delortAlert.js'
  import router from '../router.js'
  export default {
    name: "CreateQuiz",
    props: ["id"],
    mounted() {
      if (this.$route.params.id != 'new-quiz') {
        this.$store.dispatch("getActiveQuiz", this.$route.params.id)
      }
      this.$store.dispatch("getQuestions");
    },
    data() {
      return {
        selectQuestions: false,
        quiz: {
          name: '',
          topic: '',
          difficulty: '',
          questions: []
        }
      };
    },

    computed: {
      results() {
        if (this.$store.state.searchResults.length === 0) {
          return this.$store.state.questions;
        } else {
          return this.$store.state.searchResults;
        }
      },
      activeQuiz() {
        let active = this.$store.state.activeQuiz
        if (active._id) {
          this.quiz = active
        }
        return active
      },
    },
    methods: {
      prettify(arr) {
        let out = []
        arr.forEach(c => out.push(c.name))
        let str = out.join(" ");
        return str;
      },
      async deleteQuestion(id) {
        if (await delortAlert.confirm("Question")) {
          this.$store.dispatch('deleteQuestion', id)
        }
      },
      selectQuestionAlert() {
        this.$swal({
          title: "Please Select One Or More Questions",
          showConfirmButton: true,
          confirmButtonColor: "#fb8c00"
        });
      },
      quizCreated() {
        this.$swal({
          title: "Quiz Created!",
          showConfirmButton: true,
          confirmButtonColor: "#9c27b0"
        }).then(router.push({ name: "SelectQuiz" }));
      },
      quizEdited() {
        this.$swal({
          title: "Quiz Succesfully Edited!",
          showConfirmButton: true,
          confirmButtonColor: "#9c27b0"
        });
      },

      createQuiz() {
        let quiz = JSON.parse(JSON.stringify(this.quiz))
        if (this.activeQuiz._id) {
          this.$store.dispatch("editQuiz", { quiz, alert: this.quizEdited })
        }
        else if (this.quiz.questions.length < 1) {
          this.selectQuestionAlert()
        } else {
          this.$store.dispatch("createQuiz", { quiz, alert: this.quizCreated });
        }
      },
      removeQuizQuestion(i) {
        this.quiz.questions.splice(i, 1)
      }

    },
    components: {
      SearchQuestions,
      CreateQuestion,
      CategoriesComponent
    }
  };
</script>

<style>
  #available-questions {
    margin: 10vw;
  }

  .hover {
    cursor: pointer;
  }

  #addQuizIcon {
    color: white;
    visibility: visible !important;
  }

  .addQuiz {
    align-items: center;
    justify-content: flex-end;
    visibility: hidden;
    color: white;
  }

  .addQuiz:hover #quizText {
    visibility: visible;
    cursor: pointer;
  }
</style>