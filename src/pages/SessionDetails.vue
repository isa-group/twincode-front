<template>
  <div>
    <Header />
    <div class="text-center align-middle">
      <div class="inline-block w-full max-w-screen-xl">
        <div class="text-left">
          <h1 class="p-5 text-2xl md:text-3xl md:ml-3 font-semibold">
            Session details
          </h1>
        </div>
      </div>
      <div class="p-3 text-left max-w-4xl mx-auto mb-20 relative">
        <label class="absolute top-0 right-0 mr-16 text-gray-800"
          >Activation toggle:
        </label>
        <ToggleSwitch
          class="absolute top-0 right-0 mr-1"
          v-model="session.active"
          @input="toggleActivation()"
        />
        <form @submit.prevent="updateSession()">
          <div class="mt-5">
            <label>Name:</label>
            <input
              v-model="session.name"
              type="text"
              class="border rounded-sm ml-2"
            />
          </div>

          <div class="mt-5">
            <label>Token list:</label>
            <input
              v-model="session.tokens"
              type="text"
              class="border rounded-sm ml-2"
            />
          </div>
          <div class="mt-5">
            <input
              v-model="session.tokenPairing"
              type="checkbox"
              class="border rounded-sm mr-2"
            />
            <label
              >Participants with the same token cannot be paired together</label
            >
          </div>
          <button
            class="mt-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </form>
        <div class="mt-10">
          <h2 class="mb-3 text-md font-light">Participant list:</h2>
          <Table :head="['Code', 'Name', 'Email']" :body="participants" />
          <p class="mt-3 font-bold">
            Total: {{ this.participants.length }} participants.
          </p>
        </div>
        <div class="mt-10">
          <h2 class="mb-3 text-md font-light">Tests &amp; exercises:</h2>
          <Table
            :head="['Test', 'Number of exercises', 'Total time (minutes)']"
            :body="tests"
          />
          <button
            class="mt-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            @click="loadExerciseConfiguration()"
          >
            Exercise configuration
          </button>
        </div>

        <div class="mt-10 border p-3 rounded-md">
          <h2 class="mb-3 text-md font-light">Actions:</h2>
          <button
            class="mt-3 ml-2 p-3 rounded-md bg-gray-100 border px-5 text-gray-800 hover:bg-yellow-200 hover:border-yellow-300 hover:text-yellow-800"
            @click="goToReports()"
          >
            See reports
          </button>
          <button
            class="mt-3 ml-2 p-3 rounded-md bg-gray-100 border px-5 text-gray-800 hover:bg-red-200 hover:border-red-300 hover:text-red-800"
            @click="deleteSession()"
          >
            Delete session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Table from "../components/Table";
import ToggleSwitch from "../components/ToggleSwitch";
export default {
  components: {
    Header,
    Table,
    ToggleSwitch,
  },
  data() {
    return {
      session: {
        name: null,
        tokens: null,
        tokenPairing: null,
        active: null,
      },
      participants: [],
      tests: [],
    };
  },
  methods: {
    updateSession() {},
    loadSession() {
      fetch(
        `${process.env.VUE_APP_TC_API}/sessions/${this.$route.params.sessionName}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((retrievedSession) => {
          if (retrievedSession) {
            this.session.name = retrievedSession.name;
            this.session.tokens = retrievedSession.tokens;
            this.session.tokenPairing = retrievedSession.tokenPairing;
            this.session.active = retrievedSession.active;
          }
        });
    },
    loadParticipants() {
      fetch(
        `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((participants) => {
          if (participants) {
            this.participants = participants;
          }
        });
    },
    loadTests() {
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/${this.$route.params.sessionName}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((tests) => {
          if (tests) {
            let orderedTests = [];
            tests.forEach((test) => {
              let orderedTest = {};
              orderedTest.name = test.name;
              orderedTest.excercises = test.exercises.length;
              let totalTime = 0;
              test.exercises.forEach((exercise) => {
                totalTime += exercise.time;
              });
              orderedTest.totalTime = totalTime;
              orderedTests.push(orderedTest);
            });
            this.tests = orderedTests;
          }
        });
    },
    loadExerciseConfiguration() {
      this.$router.push({
        path: `/administration/exercises/${this.$route.params.sessionName}`,
      });
    },
    deleteSession() {
      var r = confirm(
        "You are going to delete session " +
          this.$route.params.sessionName +
          ". This action cannot be undone. Are you sure?"
      );
      if (r) {
        fetch(
          `${process.env.VUE_APP_TC_API}/sessions/${this.$route.params.sessionName}`,
          {
            method: "DELETE",
            headers: {
              Authorization: localStorage.adminSecret,
            },
          }
        ).then((response) => {
          if (response.status == 200) {
            this.$router.push({
              path: `/administration`,
            });
          }
        });
      }
    },
    toggleActivation() {
      fetch(
        `${process.env.VUE_APP_TC_API}/sessions/${this.$route.params.sessionName}/toggleActivation`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          alert(
            `Session is now ${this.session.active ? "active!" : "inactive!"}`
          );
        }
      });
    },
    goToReports() {
      this.$router.push({
        path: `/administration/reports/${this.$route.params.sessionName}`,
      });
    },
  },
  mounted() {
    this.loadSession();
    this.loadParticipants();
    this.loadTests();
  },
};
</script>

<style></style>
