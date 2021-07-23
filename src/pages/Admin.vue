<template>
  <div>
    <Header v-if="loggedIn" />
    <div v-if="loggedIn" class="text-center">
      <div class="inline-block w-full max-w-screen-xl">
        <div class="text-left">
          <h1 class="p-5 text-2xl md:text-3xl md:ml-3 font-semibold">
            Available sessions
          </h1>
        </div>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-10 p-5">
            <Card 
              v-for="(session, index) in sessions"
              :key="index"
              :environment="session.environment"
              :sessionName="session.name"
              :active="session.active"
              :registeredUsers="session.users.length"
            />
          <NewCard @newSession="showNewSessionModal()" />
        </div>
      </div>
    </div>
    <div v-if="!loggedIn">
      <div class="flex flex-col items-center justify-center mt-6">
        <img src="@/assets/tc_white_color.png" class="w-56" />
        <h1 class="font-light mt-2 text-white">Administration console</h1>
      </div>
      <div class="container mx-auto max-w-sm px-3 mt-24">
        <div
          class="bg-gray-200 p-10 pb-16 rounded-md shadow-lg border-gray-600 p-8 border-t-8"
          :class="error ? 'border-red-700' : 'border-gray-600'"
        >
          <form @submit.prevent="onSubmit">
            <label
              class="font-bold block mb-2 text-xl"
              :class="error ? 'text-red-600' : 'text-grey-800'"
              >Access</label
            >
            <input
              ref="codeInput"
              type="password"
              v-model="secret"
              class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Enter the secret code"
            />
          </form>
        </div>
      </div>
    </div>
    <Modal v-model="showModal" title="New session">
      <form @submit.prevent="createSession">
        <div class="mt-5">
          <label>Name:</label>
          <input
            v-model="newSession.name"
            type="text"
            class="border rounded-sm ml-2"
          />
        </div>

        <div class="mt-5">
          <label>Token list:</label>
          <input
            v-model="newSession.tokens"
            type="text"
            class="border rounded-sm ml-2"
          />
        </div>
      </form>
      <div v-if="newSession.errors" class="mb-5">
        <p class="text-red-700">{{ this.newSession.errors }}</p>
      </div>
      <template v-slot:actionButtons>
        <button
          @click="createSession()"
          class="px-4 bg-transparent p-3 rounded-lg bg-orange-400 hover:bg-orange-300 mr-2 focus:outline-none focus:shadow-outline"
        >
          Save &amp; go to exercise configuration
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Header from "../components/Header";
import Card from "../components/Card";
import NewCard from "../components/NewCard";
import Modal from "../components/Modal";

export default {
  data() {
    return {
      loggedIn: false,
      sessions: null,
      secret: null,
      error: false,
      showModal: false,
      newSession: {
        name: "",
        tokens: "",
        tokenPairing: false,
        errors: null,
      },
    };
  },
  components: {
    Header,
    Card,
    NewCard,
    Modal,
  },
  created() {
    document.body.classList.add("bg-gray-800");
    this.logIn();
  },
  methods: {
    createSession() {
      let session = {};
      session.tokens = this.newSession.tokens.split(",");
      session.name = this.newSession.name;
      session.tokenPairing = false;
      console.log(session);
      fetch(`${process.env.VUE_APP_TC_API}/sessions`, {
        method: "POST",
        headers: {
          Authorization: localStorage.adminSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      })
        .then((response) => {
          if (response.status == 200) {
            alert("Session created successfully");
            this.showModal = false;
          }
          this.logIn();
          return response.json();
        })
        .then((response) => {
          this.newSession.errors = response.errorMsg;
          setTimeout(() => {
            this.newSession.errors = null;
          }, 5000);
        });
    },
    onSubmit() {
      localStorage.adminSecret = this.secret;
      this.logIn();
      setTimeout(() => {
        if (!this.loggedIn) {
          this.error = true;
          this.$refs.codeInput.classList.add("error");
          setTimeout(() => {
            this.$refs.codeInput.classList.remove("error");
          }, 1000);
        }
      }, 1000);
    },
    logIn() {
      fetch(`${process.env.VUE_APP_TC_API}/sessions`, {
        method: "GET",
        headers: {
          Authorization: localStorage.adminSecret,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.loggedIn = true;
            document.body.classList.remove("bg-gray-800");
          }
          return response.json();
        })
        .then((json) => {
          this.sessions = json;
        });
    },
    showNewSessionModal() {
      this.showModal = true;
    },
  },
};
</script>

<style>
.error {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
