<template>
  <div>
    <Header />
    <div class="text-center align-middle">
      <div class="inline-block w-full max-w-screen-xl">
        <div class="text-left">
          <h1 class="p-5 text-2xl md:text-3xl md:ml-3 font-semibold">
            Exercise configuration
          </h1>
        </div>
      </div>
      <div class="p-3 text-left max-w-4xl mx-auto mb-20">
        <div class="mt-5">
          <h2 class="font-bold text-xl">
            {{ this.$route.params.sessionName }} session
          </h2>
        </div>
        <div class="mt-5">
          <h2 class="mb-3 text-md font-light">Tests list:</h2>
          <Table
            :head="['Test', 'Number of exercises', 'Total time (minutes)']"
            :body="orderedTests"
            v-model="selectedTest"
          />
          <button
            class="mt-3 p-1 rounded-md bg-gray-100 border px-5 text-gray-800 hover:bg-green-200 hover:border-green-300 hover:text-green-800"
            @click="createTest()"
          >
            + Add test
          </button>
          <button
            class="mt-3 ml-2 p-1 rounded-md bg-gray-100 border px-5 text-red-800 hover:bg-red-200 hover:border-red-300"
            @click="removeTest()"
          >
            - Remove test
          </button>
        </div>
        <div v-if="tests != undefined && tests.length > 0" class="mt-10">
          <h2 class="mb-3 text-md font-light">Test:</h2>
          <div class="border items-center py-6 mt-6">
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="name"
              >
                Name:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-40 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                v-model="tests[selectedTest].name"
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-top text-gray-700 text-sm font-bold mb-2"
                for="description"
              >
                Description:
              </label>
              <textarea
                class="ml-2 appearance-none border rounded py-2 px-3 w-10/12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                v-model="tests[selectedTest].description"
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="time"
              >
                Preparation time:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="number"
                v-model="tests[selectedTest].time"
              />
              <p class="inline text-gray-700 font-light mx-3">seconds</p>
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="peerChange"
              >
                Change gender:
              </label>
              <input
                class="ml-2"
                id="peerChange"
                type="checkbox"
                v-model="tests[selectedTest].peerChange"
              />
            </div>
          </div>
        </div>
        <div
          v-if="tests != undefined && tests.length > 0"
          class="mt-10 relative"
        >
          <h2 class="mb-3 text-md font-light">Exercises:</h2>
          <ButtonSelector
            v-model="selectedExerciseIndex"
            :listOfValues="tests[selectedTest].exercises"
            propertyName="name"
            class="inline"
          />
          <button
            class="inline absolute right-0 p-2 rounded-md bg-gray-100 border px-5 text-gray-800"
            @click="createExercise()"
          >
            Add excercise
          </button>
          <div
            v-if="tests[selectedTest].exercises.length > 0"
            class="border items-center py-6"
          >
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="description"
              >
                Name:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-40 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                v-model="
                  tests[selectedTest].exercises[selectedExerciseIndex].name
                "
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-top text-gray-700 text-sm font-bold mb-2"
                for="description"
              >
                Description:
              </label>
              <textarea
                class="ml-2 appearance-none border rounded py-2 px-3 w-10/12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                type="text"
                v-model="
                  tests[selectedTest].exercises[selectedExerciseIndex]
                    .description
                "
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="solution"
              >
                Solution:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-40 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="solution"
                type="number"
                v-model.number="
                  tests[selectedTest].exercises[selectedExerciseIndex].solution
                "
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="time"
              >
                Available time to complete the exercise:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="number"
                v-model.number="
                  tests[selectedTest].exercises[selectedExerciseIndex].time
                "
              />
              <p class="inline text-gray-700 font-light mx-3">seconds</p>
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="type"
              >
                Type of exercise:
              </label>
              <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-40 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="type"
                type="text"
                v-model="
                  tests[selectedTest].exercises[selectedExerciseIndex].type
                "
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto relative">
              <button
                class="mt-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
                @click="updateTest()"
              >
                Update exercise
              </button>
              <button
                class="mt-3 rounded-full bg-gray-100 hover:bg-red-200 border hover:border-red-300 p-2 px-5 absolute right-0 bottom-0 focus:outline-none focus:shadow-outline"
                @click="removeExercise()"
              >
                <img src="@/assets/icons/delete_bin.png" class="w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Table from "../components/Table";
import ButtonSelector from "../components/ButtonSelector";

export default {
  components: {
    Header,
    Table,
    ButtonSelector,
  },
  data() {
    return {
      participants: [],
      orderedTests: [],
      tests: [],
      selectedTest: 0,
      selectedExerciseIndex: 0,
      selectedExercise: {},
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
            this.orderedTests = orderedTests;
          }
          this.tests = tests;
        });
    },
    createExercise() {
      this.selectedExercise = this.tests[this.selectedTest].exercises.push({
        name: "New exercise",
        description: "",
        solution: 0,
        time: 100,
      });
    },
    createTest() {
      fetch(`${process.env.VUE_APP_TC_API}/tests`, {
        method: "POST",
        headers: {
          Authorization: localStorage.adminSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: this.$route.params.sessionName,
          name: "New Test",
          description: "A new test begins",
          time: 5,
          peerChange: false,
          orderNumber: this.orderedTests.length,
          exercises: [],
        }),
      }).then((response) => {
        if (response.status == 200) {
          this.loadTests();
        }
      });
    },
    updateTest() {
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/${this.$route.params.sessionName}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.adminSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.tests[this.selectedTest]),
        }
      ).then((response) => {
        if (response.status == 200) {
          this.loadTests();
        }
      });
    },
    removeExercise() {
      this.tests[this.selectedTest].exercises.splice(
        this.selectedExerciseIndex,
        1
      );
    },
    removeTest() {
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/${this.$route.params.sessionName}/${this.selectedTest}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          this.selectedTest = 0;
          this.loadTests();
        }
      });
    },
  },
  mounted() {
    this.loadTests();
  },
};
</script>

<style></style>
