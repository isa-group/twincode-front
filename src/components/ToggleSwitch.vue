<template>
  <div>
    <div
      class="relative rounded-full w-12 h-6 transition duration-200 ease-linear"
      :class="[this.value ? 'bg-green-400' : 'bg-gray-400']"
    >
      <label
        for="toggle"
        class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer"
        :class="[
          this.value
            ? 'translate-x-full border-green-400'
            : 'translate-x-0 border-gray-400',
        ]"
      ></label>
      <input
        type="checkbox"
        id="toggle"
        name="toggle"
        class="appearance-none w-full h-full active:outline-none focus:outline-none"
        @click="toggle()"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  methods: {
    toggle() {
      this.$emit("input", !this.value);
    },
  },
};
</script>

<style></style>
