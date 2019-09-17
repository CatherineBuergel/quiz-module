<template>
  <div class="md-layout-item my-2 md-size-100 text-center">

    <div class="d-flex row justify-content-center">
      <span v-for="(word, i) in words">
        <drop v-if="word == '___________'" class="d-flex align-items-center mr-1" @drop="handleDrop(i, dragging)">
          <div :class="submission[i] == '___________' ? 'text-danger' : 'text-info underline'">
            {{submission[i]}}</div>
        </drop>
        <span v-else>{{word}}&nbsp;</span>
      </span>

      <div class="col-12">
        <div v-for="drag in drags">
          <drag @dragstart="setDrag(drag)">{{displayQuestion(drag)}}</drag>
        </div>
      </div>
      <button type="submit" class="md-button md-sm md-info" @click="submit">
        <div class="md-ripple">
          <div class="md-button-content">Submit</div>
        </div>
      </button>
    </div>
  </div>
  </div>
</template>

<script>
  import { Drag, Drop } from "vue-drag-drop";
  import vue from "vue";
  export default {
    name: "FillInTheBlank",
    props: {
      question: { type: Object, required: true }
    },
    data() {
      return {
        submission: [],
        dragging: {}
      };
    },
    mounted() {
      this.submission = this.question.prompt.split(" ")
    },
    computed: {
      drags() {
        let arr = this.question.options;
        return this.shuffle(arr);
      },

      words() {
        return this.question.prompt.split(" ")
      }
    },
    methods: {
      submit() {
        let submissionString = this.submission.join(" ")
        this.$emit("submit", {
          question: this.question,
          submission: { value: submissionString }
        });
      },
      shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      },
      fixQuestionPromptDisplay() {
        return question.prompt.replace()
      },
      displayQuestion(q) {
        return `${Object.values(q)[0]}`;
      },

      setDrag(drag) {
        this.dragging = drag;
      },
      handleDrop(i, dragged) {
        vue.set(this.submission, i, dragged.value);
      }
    },
    components: { Drag, Drop }
  };
</script>

<style>
  .underline {
    border-bottom: 1px solid;
    min-height: 25px;
  }

  .fill-in-blank {
    min-width: 130px;
  }
</style>