<template>
  <div>
    <v-tour name="firstQ" :steps="firstSteps" :options="firstOptions"></v-tour>
  </div>
</template>

<script>
import "vue-tour/dist/vue-tour.css";

export default {
  name: "my-tour",
  props: ["firstSteps", "firstOptions"],
  mounted: function () {
    console.clear();
    console.log(this.$tours["firstQ"]);

    setTimeout(() => {
      return this.$tours["firstQ"].start();
    }, 32000) 
  },
};
</script>