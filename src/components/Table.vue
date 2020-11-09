<template>
  <table class="table-auto">
    <thead>
      <tr>
        <th v-for="(title, index) in head" class="px-4 py-2" :key="index">
          {{ title }}
        </th>
      </tr>
    </thead>
    <tbody ref="table">
      <tr
        v-for="(row, index) in body"
        :key="index"
        :id="index"
        :class="computeRowClass(index)"
        @click="clickOnRow"
      >
        <td v-for="(cell, index) in row" :key="index" class="border px-4 py-2">
          {{ cell }}
        </td>
      </tr>
      <tr v-if="body.length == 0">
        <td
          v-for="(cell, index) in head"
          :key="index"
          class="border px-4 py-2 bg-gray-100 font-thin text-center"
        >
          -
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    head: Array,
    body: Array,
    value: Number,
  },
  data() {
    return {
      rowClassList: "",
    };
  },
  methods: {
    clickOnRow(event) {
      this.$refs.table.childNodes.forEach((element) => {
        if (element.classList) element.classList.remove("bg-blue-300");
      });
      if (this.value >= 0) {
        event.target.parentElement.classList.toggle("bg-blue-300");
        this.$emit("input", parseInt(event.target.parentElement.id));
      }
    },
    computeRowClass(row) {
      let classList = "";
      if (row % 2 == 0) {
        classList += "bg-gray-100 ";
      }
      if (this.value >= 0) {
        classList += "selectable ";
      }
      if (this.value == row) {
        classList += "bg-blue-300 ";
      }
      return classList;
    },
  },
};
</script>

<style>
tbody > tr.selectable {
  cursor: pointer;
}
</style>
