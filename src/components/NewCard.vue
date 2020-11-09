<template>
  <div class="container text-center">
    <div class="w-full max-w-xs inline-block">
      <div
        class="flex items-center justify-center max-h-full h-48 border-dashed border-4 border-gray-300 rounded-lg w-full"
      >
        <button
          class="rounded-full h-12 w-12 flex items-center justify-center bg-gray-300 hover:bg-gray-400 shadow-lg hover:shadow-md text-2xl focus:outline-none focus:shadow-outline"
          @click="newSession()"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    newSession() {
      this.$emit("newSession");
    },
  },
};
</script>

<style></style>
