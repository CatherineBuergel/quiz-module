<template>
  <div class="container-fluid">
    <div class="md-card md-theme-default">
      <div class="md-card-header" data-background-color="blue">
        <h3 class="title">Question {{currentQuestion + 1}} of {{questions.length}}</h3>
      </div>
      <div class="md-card-content">
        <div class="md-layout">
          <component v-if="activeQuestion" :is="activeQuestion.type" :question="activeQuestion"
            @submit="gradeQuestion" />
          <!-- <div v-if="isSubmitted && this.currentQuestion != questions.length - 1"
            class="md-layout-item md-size-100 text-center">
            <button type="button" class="md-button md-raised md-info md-theme-default mt-3" @click="nextQuestion">
              <div class="md-ripple">
                <div class="md-button-content">Next Question</div>
              </div>
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Match from "./QuestionTypes/Match";
  import TrueFalse from "./QuestionTypes/TrueFalse";
  import OpenEnded from "./QuestionTypes/OpenEnded";
  import MultipleChoice from "./QuestionTypes/MultipleChoice";
  import FillInTheBlank from "./QuestionTypes/FillInTheBlank";
  import gradeAlert from "../gradeAlerts.js"
  import router from '../router.js'

  export default {
    name: "Question",
    created() {
    },
    data() {
      return {
        currentQuestion: 0,
        isSubmitted: false,
      };
    },

    computed: {
      questions() {
        let quiz = this.$store.state.activeQuiz
        return quiz.questions
      },
      activeQuestion() {
        return this.questions[this.currentQuestion]
      },
      grade() {
        return this.$store.state.grade
      }
    },
    methods: {
      alert() {
        if (this.currentQuestion == this.questions.length - 1) {
          return this.$swal.fire({
            title: gradeAlert.isCorrect(this.grade),
            html: gradeAlert.determineAlert(this.grade),
            type: gradeAlert.isSuccess(this.grade),
            showCancelButton: true,
            confirmButtonColor: "#00bcd4",
            confirmButtonText: "Sweet, let's take another!",
            cancelButtonColor: "#fb8c00",
            cancelButtonText: "I'd like to retake this quiz."
          })
            .then((res) => {
              if (res.value) {
                router.push({ name: "SelectQuiz" })
              }
            })
        }
        else {
          this.$swal({
            title: gradeAlert.isCorrect(this.grade),
            html: gradeAlert.determineAlert(this.grade),
            type: gradeAlert.isSuccess(this.grade),
            showCloseButton: true,
            confirmButtonColor: "#00bcd4"
          }).then((res) => {
            if (res.value) {
              this.nextQuestion()
            }
          })
        }
      },
      nextQuestion() {
        this.currentQuestion += 1
        this.isSubmitted = false
      },
      gradeQuestion({ question, submission }) {
        this.$store.dispatch("gradeQuestion", { question, submission, alert: this.alert });
        this.isSubmitted = true
      }
    },
    components: {
      Match,
      TrueFalse,
      MultipleChoice,
      OpenEnded,
      FillInTheBlank,
    }
  };
</script>