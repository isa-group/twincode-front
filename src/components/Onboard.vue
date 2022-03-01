<template>
  <div>
    <v-tour name="myTour" :steps="steps" :options="options"></v-tour>
  </div>
</template>

<script>
import "vue-tour/dist/vue-tour.css";

export default {
  name: "my-tour",
  props: ["steps", "options"],
  mounted: function () {
    console.clear();
    console.log(this.$tours["myTour"]);

    setTimeout(() => {
      return this.$tours["myTour"].start();
    }, 37000) 
  },
};
</script>