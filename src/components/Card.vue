<template>
  <div class="container text-center">
    <div
      class="shadow-lg w-full h-48 rounded-lg max-w-xs inline-block text-left"
    >
      <div class="flex mt-5 ml-8 mr-8 items-center">
        <h1 class="font-bold text-lg">
          {{ sessionName }}
        </h1>
        <div v-if="environment === 'local'" class="flex-none flex ml-2 ">
          <div class="rounded-full h-2 w-2 bg-red-500 inline-block"></div>
          <!--<p class="text-red-500 inline text-xs">
            Local
          </p>-->
        </div>
        <div class="text-right flex-grow">
          <h1
            class="font-bold text-lg"
            :class="active ? 'text-green-400' : 'text-gray-500'"
          >
            {{ active ? "Active" : "Inactive" }}
          </h1>
        </div>
      </div>
      <p class="font-bold text-lg ml-8 mt-5">
        {{ registeredUsers }} registered users
      </p>
      <div class="flex mt-5 ml-8 mr-8 items-center justify-between">
        <button
          class="rounded-full bg-orange-400 p-2 w-full font-bold m-2 focus:outline-none focus:shadow-outline"
          @click="loadSessionDetails()"
        >
          View
        </button>
        <button
          @click="onReset"
          class="rounded-full bg-gray-400 p-2 w-full font-bold m-2 focus:outline-none focus:shadow-outline"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sessionName: String,
    active: Boolean,
    registeredUsers: Number,
    environment: String,
  },
  methods: {
    onReset() {
      fetch(process.env.VUE_APP_TC_API + "/resetSession", {
        method: "POST", // or 'PUT'
        body: JSON.stringify({ session: this.sessionName }), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.adminSecret,
        },
      }).then((response) => {
        if (response.status == 200) {
          alert("Session restarted successfully");
        }
      });
    },
    loadSessionDetails() {
      this.$router.push({
        path: `/administration/sessions/${this.sessionName}`,
      });
    },
  },
};
</script>

<style></style>
