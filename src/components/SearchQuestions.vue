<template>
  <div class="searchQuestions md-theme-default md-layout">
    <div class="md-layout-item md-layout md-alignment-center-center md-size-33  md-small-size-50 md-xsmall-size-100">
      <CategoriesComponent v-on:change-categories='updateCategories($event)'></CategoriesComponent>
    </div>
    <div class="md-layout-item md-layout md-size-33 md-small-size-50 md-xsmall-size-100">
      <md-field class="has-danger md-theme-default">
        <label>Search By Prompt</label>
        <md-input></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-33
       md-small-size-50 md-xsmall-size-100 d-flex align-items-center justify-content-center">
      <div id="add-question" class="d-flex align-items-center justify-content-flex-start">
        <span class="description text-left">
          Add A Category
        </span>
        <i class="fas fa-lg fa-plus text-info" @click="showInput = !showInput">
        </i>
      </div>
      <button @click="search" class="md-button md-raised md-info md-theme-default">
        <div class="md-ripple">
          <div class="md-button-content">Search</div>
        </div>
      </button>
      <button id="right-button" class="md-button md-raised md-info md-theme-default">
        <div class="md-ripple">
          <div class="md-button-content">Clear</div>
        </div>
      </button>
    </div>
    <div v-show="showInput"
      class="md-layout-item md-alignment-center-center md-size-66  md-small-size-50 md-xsmall-size-100">
      <CreateCategory></CreateCategory>
    </div>
  </div>
</template>

<script>
  import CategoriesComponent from '@/components/CategoriesComponent.vue'
  import CreateCategory from '@/components/CreateCategory.vue'
  export default {
    name: "searchQuestions",
    props: [],
    data() {
      return {
        showInput: false,
        categories: [],
        prompt: ''
      }
    },
    computed: {},
    methods: {
      updateCategories(payload) {
        this.categories = payload
      },
      search() {
        if (this.categories.length > 0) {
          this.$store.dispatch('searchQuestions', this.categories)
          this.resetCategories()
        }
        else {
          return this.$store.state.searchResults
        }
      },
      resetCategories() {
        this.categories = []
      }
    },
    components: {
      CategoriesComponent,
      CreateCategory
    }
  }
</script>
<style scoped>
  #right-button {
    margin-right: 1rem;
  }

  .description {
    visibility: hidden;
    max-width: 3rem;
    justify-self: flex-start;
    margin-right: 2rem;
  }

  i:hover {
    cursor: pointer;
  }

  #add-question:hover .description {
    cursor: pointer;
    visibility: visible;
  }
</style>