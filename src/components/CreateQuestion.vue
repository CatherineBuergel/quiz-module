<template>
  <div class="modal" id="questionModal">

    <div class="CreateQuestion md-layout md-alignment-center-center mt-5">
      <div class="md-layout-item md-size-100">
        <div class="md-card md-theme-default">
          <div class="md-card-header" data-background-color="orange">
            <h3 class="title"><strong>Select Category Type</strong></h3>
          </div>
          <div class="md-card-content">
            <div class="md-content md-table md-theme-default" table-header-color="orange">
              <div class="md-content md-table-content md-scrollbar md-theme-default">
                <CategoriesComponent id="modalDropdown" v-on:change-categories='updateCategories($event)'>
                </CategoriesComponent>
                <div class="md-layout-item md-size-100 md-small-size-50 md-alignment-center-center">
                  <md-field>
                    <label>Question Type</label>
                    <md-select v-model="selected" id="questionType">
                      <md-option v-for="type in types" :value="type.value" :key="type.text">{{type.text}}</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-100">
              <component v-if="categories.length > 0" :is="selected" v-on:createQuestion="createQuestion($event)"
                :type="selected"></component>
            </div>
            <button class="md-button md-warning" type="button" data-dismiss="modal"
              data-target="#questionModal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Match from "./CreateQuestionTypes/Match.vue"
  import TrueFalse from './CreateQuestionTypes/TrueFalse.vue'
  import FillInTheBlank from './CreateQuestionTypes/FillInTheBlank.vue'
  import CategoriesComponent from '@/components/CategoriesComponent.vue'
  import OpenEnded from './CreateQuestionTypes/OpenEnded.vue'
  import MultipleChoice from './CreateQuestionTypes/MultipleChoice.vue'
  export default {
    name: "CreateQuestion",
    props: [],
    data() {
      return {
        selected: '',
        categories: [],
        selectTypeOpen: true,
        types: [
          { text: 'Matching', value: 'Match' },
          { text: 'True False', value: 'TrueFalse' },
          { text: 'Multiple Choice', value: 'MultipleChoice' },
          { text: 'Open Ended', value: 'OpenEnded' },
          { text: 'Fill in the Blank', value: 'FillInTheBlank' }
        ],
        categoriesArray: ["HTML", "CSS", "Style and Design", "Built In Methods", "SOLID", "OOP", "C#", "Scrum", "Javascript", "Design Patterns"]
      }
    },
    computed: {},
    watch: {
      selected: function () {
        if (this.categories.length == 0) {
          this.categoryAlert()
        }
      }
    },
    methods: {
      createQuestion(question) {
        question.categories = this.categories
        question.type = this.selected
        this.$store.dispatch('createQuestion', question)
      },

      updateCategories(payload) {
        this.categories = payload
      },
      categoryAlert() {
        this.$swal({
          title: 'Required Category',
          text: 'Please Select A Category',
          showCloseButton: true,
          confirmButtonColor: "#fb8c00"
        });
      }
    },
    components: {
      Match,
      TrueFalse,
      FillInTheBlank,
      CategoriesComponent,
      OpenEnded,
      MultipleChoice
    }
  }
</script>
<style>
  #questionType {
    width: 25%;
  }

  .fa-check {
    color: green;
  }

  #modalDropdown {
    position: relative !important;
    z-index: 5000 !important;
  }

  .md-menu-content.md-select-menu {
    z-index: 5000 !important;

  }
</style>