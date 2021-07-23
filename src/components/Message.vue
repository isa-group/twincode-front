<template>
  <div class="flex mb-1 mt-1" :class="mine ? 'justify-end' : 'justify-start'">
    <div class="flex-shrink-0" v-if="!mine && girl != null">
      <img class="rounded-full w-12 h-12" :src="getImages()" />
    </div>
    <div
      class="flex-inital p-3 border rounded-t-lg"
      :class="mine ? 'rounded-bl-lg bg-white' : 'rounded-br-lg bg-teal-200'"
    >
      <p class="break-words">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mine: Boolean,
    message: String,
    girl: Boolean,
  },
  methods: {
    getImages() {
      const images = require.context("@/assets/", false, /\.svg$/);
      let image = "";
      if (this.girl) {
        image = images("./girl.svg");
      } else {
        image = images("./boy.svg");
      }
      return image;
    },
  },
};
</script>

<style></style>
