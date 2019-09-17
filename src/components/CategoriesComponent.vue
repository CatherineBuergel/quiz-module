<template>
  <div class="md-layout-item md-alignment-center-center md-size-100">
    <md-field>
      <label>Select Category</label>
      <md-select md-dense v-model="categories" multiple>
        <div v-for="category in categoriesArray" :key="category.name" class="d-flex">
          <md-option :md-ripple="false" class="smaller" md-dense :value="category._id" :key="category._id">
            {{category.name}}
          </md-option>
          <i class="fas fa-ban float-right align-self-center" @click="deleteCategory(category._id)"></i>
        </div>
      </md-select>
    </md-field>
  </div>
</template>

<script>
  import delortAlert from '../delortAlert.js'
  export default {
    name: "Categories",
    props: ['categoriesFromParent'],
    mounted() {
      this.$store.dispatch('getCategories')
      this.$material.ripple = false
    },
    data() {
      return {
        categories: [],
      }
    },
    watch: {
      categories: function () {
        this.updateCategories()
      }
    },
    computed: {
      categoriesArray() {
        return this.$store.state.categories
      }
    },
    methods: {
      updateCategories() {
        this.$emit('change-categories', this.categories)
      },
      async deleteCategory(id) {
        if (await delortAlert.confirm('category')) {
          this.$store.dispatch('deleteCategory', id)
        }
      }
    },
    components: {
    }
  }
</script>

<style>
  #category-names {
    text-align: center;
    margin-top: 1em;
  }

  h6 {
    margin-top: 1em !important;
    margin-left: 4em !important;
    min-width: 100%;
  }

  .md-list-item .md-list-item-container .md-ripple>span {
    position: relative;
    width: 100%;
    padding-top: .2em;
  }

  .fa-ban {
    width: fit-content !important;
    float: right;
    z-index: 1;
  }

  .smaller {
    display: inline-block;
    width: 90%;
  }

  .md-ripple {
    width: inherit;
    height: inherit;
    position: inherit;
    z-index: inherit;
    overflow: inherit;
    -webkit-mask-image: radial-gradient(circle, #fff 100%, #000 0);
  }
</style>