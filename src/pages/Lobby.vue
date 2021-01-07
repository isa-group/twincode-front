<template>
  <div class="bg-red-100 h-screen font-sans">
    <div class="container mx-auto h-full flex justify-center items-center">
      <div class="w-1/3">
        <h1 class="mb-6 text-center font-hairline text-3xl">
          Lobby
        </h1>
        <div
          v-if="!waitingForPeer"
          class="border-red-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-md"
        >
          <div
            v-if="invalidToken"
            class="bg-red-200 border-red-300 border mb-6 rounded"
          >
            <p class="text-red-800 text-sm p-2">
              Invalid token. Check for typos and ask your session coordinatos if
              you think it is an error.
            </p>
          </div>
          <form @submit.prevent="onSubmit">
            <div class="mb-6">
              <label class="font-bold text-grey-800 block mb-2"
                >Introduce the token provided by the session coordinator</label
              >
              <input
                type="text"
                v-model="tokenId"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Type here the token"
              />
            </div>

            <div class="flex items-center justify-between">
              <button
                type="submit"
                class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
        <div v-if="waitingForPeer">
          <h1 class="mb-6 text-center text-3xl">
            Waiting for peer
          </h1>
        </div>

        <div v-if="waitingForPeer" class="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            style="
              margin: auto;
              display: block;
              background-position: initial initial;
              background-repeat: initial initial;
            "
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke="#e53e3e"
              stroke-width="2"
            >
              <animate
                attributeName="r"
                repeatCount="indefinite"
                dur="1.6393442622950818s"
                values="0;40"
                keyTimes="0;1"
                keySplines="0 0.2 0.8 1"
                calcMode="spline"
                begin="-0.8196721311475409s"
              ></animate>
              <animate
                attributeName="opacity"
                repeatCount="indefinite"
                dur="1.6393442622950818s"
                values="1;0"
                keyTimes="0;1"
                keySplines="0.2 0 0.8 1"
                calcMode="spline"
                begin="-0.8196721311475409s"
              ></animate>
            </circle>
            <circle
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke="#f5c61b"
              stroke-width="2"
            >
              <animate
                attributeName="r"
                repeatCount="indefinite"
                dur="1.6393442622950818s"
                values="0;40"
                keyTimes="0;1"
                keySplines="0 0.2 0.8 1"
                calcMode="spline"
              ></animate>
              <animate
                attributeName="opacity"
                repeatCount="indefinite"
                dur="1.6393442622950818s"
                values="1;0"
                keyTimes="0;1"
                keySplines="0.2 0 0.8 1"
                calcMode="spline"
              ></animate>
            </circle>
          </svg>
        </div>

        <div class="text-center">
          <p class="text-grey-dark text-sm">Universidad de Sevilla</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      invalidToken: false,
      waitingForPeer: false,
      tokenId: "",
    };
  },
  sockets: {
    sessionStart(val) {
      console.log("Session started!");
      window.location.href = "/rooms/controlled/" + val.room;
      console.log("Converting to string: " + val.user);
      console.log(JSON.stringify(val.user));
      localStorage.setItem("user", JSON.stringify(val.user));
      localStorage.setItem("pairedTo", val.pairedTo);
    },
    clientJoinAgain() {
      this.performConnection();
    },
  },
  methods: {
    onSubmit() {
      console.log(this.$socket.client.id);
      localStorage.removeItem("demoExercise");
      fetch(process.env.VUE_APP_TC_API + "/registerUser", {
        method: "POST",
        body: JSON.stringify({
          tokenId: this.tokenId,
          code: localStorage.getItem("code"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status == 200) {
          this.performConnection();
        } else if (response.status == 404) {
          this.invalidToken = true;
        }
      });
    },
    performConnection() {
      console.log("Performing connection...");
      this.$socket.client.emit("clientReady", localStorage.getItem("code"));
      this.$socket.client.emit("clientConnected", localStorage.getItem("code"));
      localStorage.setItem("token", localStorage.getItem("code"));
      this.waitingForPeer = true;
    },
  },
};
</script>

<style></style>
