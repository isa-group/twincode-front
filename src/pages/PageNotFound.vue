<template>
  <div class="page h-screen w-auto">
    <div
      class="sm:inline-block text-center p-4 sm:mt-24 sm:w-1/2 relative sm:align-top"
    >
      <h1 class="text-3xl sm:text-5xl font-semibold">404 NOT FOUND</h1>
      <h2 class="hidden sm:block text-lg">
        Maybe some aliens took it from where it was...
      </h2>
    </div>
    <div class="sm:inline-block p-12 sm:w-1/2">
      <img src="@/assets/404.svg" class="sm:max-w-xs md:max-w-sm" />
    </div>
    <div class="sm:inline-block text-center p-5 sm:hidden">
      <h2 class="text-xl font-light">
        Maybe some aliens took it from where it was...
      </h2>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h1 {
  color: #ba7600;
}

.page {
  background-color: #fff8eb;
}
</style>
