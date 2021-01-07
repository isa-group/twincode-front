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
        v-for="(row, indexRow) in body"
        :key="indexRow"
        :id="indexRow"
        :class="computeRowClass(indexRow)"
        @click="clickOnRow"
      >
        <td
          v-for="(cell, index) in row"
          :key="index"
          class="border px-4 py-2"
          :class="invisible.includes(index) ? 'hidden' : ''"
        >
          <span
            v-if="cell !== true && cell !== false"
            style="pointer-events: none"
          >
            {{ cell }}
          </span>
          <span v-else>
            <div
              class="rounded-full w-3 h-3 mx-auto"
              :class="cell === true ? 'bg-green-500' : 'bg-gray-500'"
            ></div>
          </span>
        </td>
        <td
          v-for="(action, index) in actions"
          :key="index"
          class="border px-4 py-2"
        >
          <img
            @click="$emit(action.eventName, body[indexRow][action.key])"
            :src="action.icon"
            class="w-5 cursor-pointer mx-auto"
          />
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
    actions: Array,
    invisible: {
      type: Array,
      default: () => [],
    },
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
