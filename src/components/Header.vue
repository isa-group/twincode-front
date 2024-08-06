<template>
  <div
    class="h-16 w-full bg-gray-900 flex content-center items-center justify-between"
  >
    <img
      src="@/assets/tc_white_color.png"
      class="w-40 md:w-48 md:float-right ml-3 inline md:mr-8 md:order-last"
    />
    <div>
        <h1
        class="inline text-white font-thin text-sm md:text-xl mr-3 md:ml-8 text-right"
        >
            Administration console
        </h1>
        <button
        @click="goToConfig"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Config
        </button>
    </div>
    
  </div>
</template>

<script>
export default {
  methods: {
    goToConfig() {
      this.$router.push('/administration/config');
    },
  },
};
</script>

<style></style>
