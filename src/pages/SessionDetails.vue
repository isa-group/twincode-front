<template>
  <div>
    <Header v-if="loggedIn && sessionExists" />
    <div v-if="loggedIn && sessionExists" class="text-center align-middle">
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
        <form>
          <div class="mt-5">
            <label>Name:</label>
            <input
              v-model="session.name"
              type="text"
              class="border rounded-sm ml-2 p-1"
            />
          </div>

          <div class="mt-5">
            <label>Token list:</label>
            <input
              v-model="session.tokens"
              type="text"
              class="border rounded-sm ml-2 p-1"
            />
          </div>

          <div class="mt-5">
            <input
              v-model="session.blindParticipant"
              type="checkbox"
              class="border rounded-sm mr-2"
            />
            <label
              >One participant should not see avatar during the session</label
            >
          </div>
          <button
            class="mt-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            type="button"
            @click="updateSession()"
          >
            Save
          </button>
        </form>
        <div class="mt-10">
          <h2 class="mb-3 text-md font-light">Participant list:</h2>
          <Table
            :head="[
              'Code',
              'Name',
              'Email',
              'Room',
              'Status',
              'Rejoin',
              'Delete',
            ]"
            :body="participants"
            :actions="[
              { eventName: 'rejoin', icon: reloadIconUrl, key: 'socketId' },
              { eventName: 'delete', icon: deleteIconUrl, key: 'mail' },
            ]"
            :invisible="['socketId']"
            @delete="deleteUser($event)"
            @rejoin="rejoinUser($event)"
          />
          <p class="mt-3 font-bold">
            Total: {{ this.participants.length }} participants.
          </p>
        </div>
        <div class="mt-10">
          <h2 class="mb-3 text-md font-light">Tests &amp; exercises:</h2>
          <Table
            :head="['Test', 'Number of exercises', 'Total time (seconds)']"
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
            class="mt-3 ml-2 p-3 rounded-md bg-gray-100 border px-5 text-gray-800 w-48"
            :class="
              session.running
                ? 'hover:bg-gray-200 hover:border-gray-300 hover:text-gray-800'
                : 'hover:bg-green-200 hover:border-green-300 hover:text-green-800'
            "
            @click="toggleSessionMethod()"
          >
            <img
              v-if="waitingStartResponse"
              src="@/assets/icons/loading.gif"
              class="h-5 inline"
            />
            <span v-if="!waitingStartResponse && session.running == false"
              >Start session</span
            >
            <span v-if="!waitingStartResponse && session.running == true"
              >Reset session</span
            >
          </button>
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
        
          <button
            class="mt-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            type="button"
            @click="goBack()"
          >
            Go Back
          </button>
      </div>
    </div>
    <div style="width: 320px; margin-left: auto; margin-right: auto; margin-top: 200px;" class="typewriter" v-if="!loggedIn || !sessionExists">
      <h1>Sorry! This page is not available</h1>
    </div>
  </div>
</template>
<style>
.typewriter h1 {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15em solid orange; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em; /* Adjust as needed */
  animation: 
    typing 3s steps(50, end),
    blink-caret .75s step-end infinite;
}
 
/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
 
/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>

<script>
import Header from "../components/Header";
import Table from "../components/Table";
import ToggleSwitch from "../components/ToggleSwitch";
import deleteIcon from "@/assets/icons/delete_bin.png";
import reloadIcon from "@/assets/icons/reload.png";

export default {
  components: {
    Header,
    Table,
    ToggleSwitch,
  },
  data() {
    return {
      loggedIn: false,
      sessionExists: false,
      session: {
        name: null,
        tokens: null,
        tokenPairing: null,
        blindParticipant: null,
        active: null,
        running: null,
        pairingMode: null,
      },
      participants: [],
      tests: [],
      deleteIconUrl: deleteIcon,
      reloadIconUrl: reloadIcon,
      waitingStartResponse: false,
    };
  },
  sockets: {
    clientConnected(code) {
      console.log("Participant " + code + " joined");
      setTimeout(() => {
        this.loadParticipants();
      }, 500);
    },
    clientDisconnected(code) {
      console.log("Participant " + code + " disconnected");
      setTimeout(() => {
        this.loadParticipants();
      }, 500);
    },
  },
  methods: {
    goBack() {
      this.$router.push({
        path: `/administration`,
      });
    },
    deleteUser(userEmail) {
      var r = confirm(
        "You are going to remove the participant with email " +
          userEmail +
          ". This action cannot be undone. Are you sure?"
      );
      if (r) {
        fetch(
          `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/${userEmail}`,
          {
            method: "DELETE",
            headers: {
              Authorization: localStorage.adminSecret,
            },
          }
        ).then((response) => {
          if (response.status == 200) {
            this.loadParticipants();
          }
        });
      }
    },
    rejoinUser(socketId) {
      if (socketId) {
        console.log("Asking " + socketId + " to rejoin.");
        this.$socket.client.emit("requestToJoinAgain", socketId);
      }
    },
    toggleSessionMethod() {
      if (!this.waitingStartResponse) {
        if (this.session.running) {
          this.resetSession();
        } else {
          this.startSession();
        }
      }
    },
    startSession() {
      console.log("Session starting...");
      this.waitingStartResponse = true;
      fetch(
        `${process.env.VUE_APP_TC_API}/startSession/${this.$route.params.sessionName}`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          setTimeout(() => {
            this.loadSession();
          }, 6000);
          return response.json();
        }
      });
    },
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
            this.sessionExists = true;
            return response.json();
          } 
        })
        .then((retrievedSession) => {
          if (retrievedSession) {
            this.session.name = retrievedSession.name;
            this.session.tokens = retrievedSession.tokens;
            this.session.tokenPairing = retrievedSession.tokenPairing;
            this.session.blindParticipant = retrievedSession.blindParticipant;
            this.session.active = retrievedSession.active;
            this.session.running = retrievedSession.running;
            this.session.pairingMode = retrievedSession.pairingMode;
          }
          this.waitingStartResponse = false;
        });
    },
    resetSession() {
      this.waitingStartResponse = true;
      fetch(process.env.VUE_APP_TC_API + "/resetSession", {
        method: "POST",
        body: JSON.stringify({ session: this.$route.params.sessionName }), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.adminSecret,
        },
      }).then((response) => {
        if (response.status == 200) {
          setTimeout(() => {
            this.loadSession();
          }, 1000);
        }
      });
    },
    loadParticipants() {
      fetch(`${process.env.VUE_APP_TC_API}/sessions`, {
        method: "GET",
        headers: {
          Authorization: localStorage.adminSecret,
        },
      })
        .then((response) => {
          if (response.status == 200) {
            this.loggedIn = true;
          }
          return response.json();
        });
      console.log("loading participants");
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
    updateSession() {
      console.log("Updating session... " + this.$route.params.sessionName);
      console.log("Data: " + JSON.stringify(this.session, null, 2));
      fetch(
        `${process.env.VUE_APP_TC_API}/sessions/${this.$route.params.sessionName}`,
        {
          method: "PUT",
          body: JSON.stringify(this.session),
          headers: {
            Authorization: localStorage.adminSecret,
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          alert(`Session Updated!`);
        }
      });
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
    this.$socket.client.emit("adminConnected", this.$route.params.sessionName);
  },
};
</script>

<style></style>
