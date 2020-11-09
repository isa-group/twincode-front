<template>
  <div ref="buttons">
    <button
      class="p-3 border"
      v-for="(item, index) in listOfValues"
      :key="index"
      :id="index"
      :class="computeClass(index)"
      @click="select"
    >
      {{ item[propertyName] }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    listOfValues: Array,
    propertyName: String,
  },
  methods: {
    select(event) {
      this.$refs.buttons.childNodes.forEach((element) => {
        element.classList.remove("bg-blue-300");
      });
      event.target.classList.toggle("bg-blue-300");
      this.$emit("input", parseInt(event.target.id));
    },
    computeClass(index) {
      let classList = "";
      if (index == this.value) {
        classList += "bg-blue-300 ";
      }
      return classList;
    },
  },
};
</script>

<style></style>
