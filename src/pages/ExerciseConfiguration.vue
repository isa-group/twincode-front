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
            :head="['Test', 'Number of exercises', 'Total time (seconds)']"
            :body="orderedTests"
            v-model="selectedTest"
          />
          <button
            class="
              mt-3
              p-1
              rounded-md
              bg-gray-100
              border
              px-5
              text-gray-800
              hover:bg-green-200
              hover:border-green-300
              hover:text-green-800
            "
            @click="createTest()"
          >
            + Add test
          </button>
          <button
            class="
              mt-3
              ml-2
              p-1
              rounded-md
              bg-gray-100
              border
              px-5
              text-red-800
              hover:bg-red-200
              hover:border-red-300
            "
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-40
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-10/12
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-20
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
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
            class="
              inline
              absolute
              right-0
              p-2
              rounded-md
              bg-gray-100
              border
              px-5
              text-gray-800
            "
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-40
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`exerciseName${selectedExerciseIndex}`"
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-10/12
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`exerciseDescription${selectedExerciseIndex}`"
                type="text"
                v-model="
                  tests[selectedTest].exercises[selectedExerciseIndex]
                    .description
                "
              />
            </div>
            <div class="mt-4 max-w-xl mx-auto border: 1px">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="solution"
              >
                Validations:
              </label>
              <input
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-1
                  px-2
                  w-20
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`inputNewInput`"
                type="text"
              />
              <input
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-1
                  px-2
                  w-20
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`inputNewSolution`"
                type="text"
              />
              <button
                class="
                  inline
                  right-0
                  p-2
                  rounded-md
                  bg-gray-100
                  border
                  px-9
                  text-gray-800
                "
                @click="newValidation()"
              >
                New Validation
              </button>
              <div :id="`ex${selectedExerciseIndex}validations`">
                <br />

                <li
                  v-for="(val, index) in tests[selectedTest].exercises[
                    selectedExerciseIndex
                  ].validations"
                  :key="index"
                >
                  <label
                    :id="`inputLabel-${index}`"
                    class="align-middle text-gray-700 text-sm font-bold mb-2"
                    for="type"
                  >
                    Input:
                  </label>
                  <input
                    class="
                      ml-2
                      appearance-none
                      border
                      rounded
                      py-2
                      px-2
                      w-20
                      text-gray-700
                      leading-tight
                      focus:outline-none
                      focus:shadow-outline
                    "
                    :id="`ex${selectedExerciseIndex}validationInput-${index}`"
                    type="text"
                    :value="val.input"
                  />
                  <label
                    :id="`solutionLabel-${index}`"
                    class="align-middle text-gray-700 text-sm font-bold mb-2"
                    for="type"
                  >
                    Solution:
                  </label>
                  <input
                    :id="`ex${selectedExerciseIndex}validationSolution-${index}`"
                    class="
                      ml-2
                      appearance-none
                      border
                      rounded
                      py-2
                      px-2
                      w-10
                      text-gray-700
                      leading-tight
                      focus:outline-none
                      focus:shadow-outline
                    "
                    type="text"
                    :value="val.solution"
                  />

                  <button
                    class="btn-3 rounded-full hover:bg-red-200 right-0 p-2 px-3"
                    @click="removeValidation(`${index}`)"
                  >
                    <img src="@/assets/icons/delete_bin.png" class="w-5" />
                  </button>
                </li>
              </div>

              <!-- <input
                class="ml-2 appearance-none border rounded py-2 px-3 w-40 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="solution"
                type="number"
                v-model.number="
                  tests[selectedTest].exercises[selectedExerciseIndex].solution
                "
              /> -->
            </div>
            <div class="mt-4 max-w-xl mx-auto">
              <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="time"
              >
                Available time to complete the exercise:
              </label>
              <input
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-20
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`ex${selectedExerciseIndex}Time`"
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
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-40
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                :id="`ex${selectedExerciseIndex}Type`"
                type="text"
                v-model="
                  tests[selectedTest].exercises[selectedExerciseIndex].type
                "
              />
              <!-- <label
                class="align-middle text-gray-700 text-sm font-bold mb-2"
                for="type"
              >
                Language:
              </label>
              <select
                class="
                  ml-2
                  appearance-none
                  border
                  rounded
                  py-2
                  px-3
                  w-30
                  text-gray-700
                  leading-tight
                  focus:outline-none
                  focus:shadow-outline
                "
                name="Choose the Language"
                id="language"
              >
                <option selected value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
              </select> -->
            </div>
            <div class="mt-4 max-w-xl mx-auto relative">
              <button
                class="
                  mt-3
                  mr-3
                  rounded-full
                  bg-gray-200
                  p-2
                  px-5
                  hover:bg-gray-300
                  focus:outline-none
                  focus:shadow-outline
                "
                @click="playDemoExercise()"
              >
                <img
                  src="@/assets/icons/play_icon.png"
                  class="w-5 inline-block mr-1"
                />
                <p class="inline-block text-green-900 align-middle font-medium">
                  Play demo exercise
                </p>
              </button>
              <button
                class="
                  mt-3
                  rounded-full
                  bg-gray-100
                  hover:bg-red-200
                  border
                  hover:border-red-300
                  p-2
                  px-5
                  absolute
                  right-0
                  bottom-0
                  focus:outline-none
                  focus:shadow-outline
                "
                @click="removeExercise()"
              >
                <img src="@/assets/icons/delete_bin.png" class="w-5" />
              </button>
            </div>
          </div>
          <button
            class="
              mt-3
              rounded-full
              bg-orange-400
              p-2
              px-5
              focus:outline-none
              focus:shadow-outline
            "
            @click="updateTest()"
          >
            Update test
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="badInput"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px)"
    >
      <div
        class="
          border-teal-600
          p-8
          border-t-8
          bg-white
          mb-6
          rounded-md
          shadow-lg
          m-5
          w-2/3
        "
      >
        <h1 class="font-bold text-2xl mb-4">Bad Input!</h1>
        <button
          class="
            mt-3
            rounded-full
            bg-orange-400
            p-2
            px-5
            focus:outline-none
            focus:shadow-outline
          "
          @click="wrongInput()"
        >
          close
        </button>
      </div>
    </div>
    <div
      v-if="existsInput"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px)"
    >
      <div
        class="
          border-teal-600
          p-8
          border-t-8
          bg-white
          mb-6
          rounded-md
          shadow-lg
          m-5
          w-2/3
        "
      >
        <h1 class="font-bold text-2xl mb-4">That Input already exists!</h1>
        <button
          class="
            mt-3
            rounded-full
            bg-orange-400
            p-2
            px-5
            focus:outline-none
            focus:shadow-outline
          "
          @click="containsInput()"
        >
          close
        </button>
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
      selectedExercise: 0,
      selectedValidation: {},
      language: "",
      badInput: false,
      existsInput: false,
    };
  },
  methods: {
    playDemoExercise() {
      localStorage.demoExercise = JSON.stringify(
        this.tests[this.selectedTest].exercises[this.selectedExerciseIndex]
      );
      // var language = document.getElementById("language").value;
      // console.log(language);
      // localStorage.setItem("language", language);
      this.$router.push({
        path: `/playground`,
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
      var name = this.tests[this.selectedTest].name;
      fetch(`${process.env.VUE_APP_TC_API}/tests/` + name + "/exercises", {
        method: "PUT",
        headers: {
          Authorization: localStorage.adminSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Exercise",
          description: "A new exercise",
          time: 5,
          type: "",
          validations: [],
        }),
      }).then((response) => {
        if (response.status == 200) {
          this.loadTests();
        }
      });
      this.selectedExercise = this.tests[this.selectedTest].exercises.push({
        name: "New exercise",
        description: "New description",
        time: 100,
        validations: [],
      });
    },
    newValidation() {
      var input = parseInt(document.getElementById("inputNewInput").value);
      var solution = parseInt(
        document.getElementById("inputNewSolution").value
      );
      var contains = false;
      Array.from(
        this.tests[this.selectedTest].exercises[this.selectedExerciseIndex]
          .validations
      ).forEach((e) => {
        if (e.input == input) {
          contains = true;
        }
      });
      if (input == "" || isNaN(input) || solution == "" || isNaN(solution)) {
        console.error("Input or Solution cannot be empty");
        this.badInput = true;
      } else if (contains) {
        console.error("That input already exists");
        this.existsInput = true;
      } else {
        fetch(
          `${process.env.VUE_APP_TC_API}/tests/` +
            this.tests[this.selectedTest].name +
            "/exercises/" +
            this.selectedExerciseIndex +
            "/validations",
          {
            method: "POST",
            headers: {
              Authorization: localStorage.adminSecret,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: input,
              solution: solution,
            }),
          }
        ).then((response) => {
          if (response.status == 200) {
            this.selectedValidation = this.tests[this.selectedTest].exercises[
              this.selectedExerciseIndex
            ].validations.push({
              input: document.getElementById("inputNewInput").value,
              solution: document.getElementById("inputNewSolution").value,
            });
            this.loadTests();
          }
        });
      }
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
      try {
        var finalValidations = [];

        this.tests[this.selectedTest].exercises.forEach((exercise, index) => {
          var array = Array.from(
            document
              .getElementById("ex" + index + "validations")
              .getElementsByTagName("li")
          );
          array.forEach((e) => {
            finalValidations.push({
              input: Array.from(e.getElementsByTagName("input"))[0].value,
              solution: Array.from(e.getElementsByTagName("input"))[1].value,
            });
          });
          exercise.name = document.getElementById("exerciseName" + index).value;
          exercise.description = document.getElementById(
            "exerciseDescription" + index
          ).value;
          exercise.time = document.getElementById("ex" + index + "Time").value;
          exercise.type = document.getElementById("ex" + index + "Type").value;
          exercise.validations = finalValidations;
          
        });
      } catch (e) {
        console.log("No exercises found: " + e.toString());
        fetch(
          `${process.env.VUE_APP_TC_API}/tests/${this.$route.params.sessionName}`,
          {
            method: "PUT",
            headers: {
              Authorization: localStorage.adminSecret,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session: this.$route.params.sessionName,
              name: document.getElementById("name").value,
              description: document.getElementById("description").value,
              time: document.getElementById("time").value,
              peerChange: document.getElementById("peerChange").checked,
              orderNumber: this.selectedTest,
              exercises: [],
            }),
          }
        ).then((response) => {
          if (response.status == 200) {
            this.loadTests();
          }
        });
      }
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/${this.$route.params.sessionName}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.adminSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: this.$route.params.sessionName,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            time: document.getElementById("time").value,
            peerChange: document.getElementById("peerChange").checked,
            orderNumber: this.selectedTest,
            exercises: this.tests[this.selectedTest].exercises,
          }),
        }
      ).then((response) => {
        console.log("whatever");
        if (response.status == 200) {
          this.loadTests();
        }
      });
    },
    removeExercise() {
      // var id = this.tests[this.selectedTest].exercises[this.selectedExerciseIndex]
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/` +
          this.tests[this.selectedTest].name +
          "/exercises/" +
          this.selectedExerciseIndex,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          this.tests[this.selectedTest].exercises.splice(
            this.selectedExerciseIndex,
            1
          );
          this.loadTests();
        }
      });
    },
    wrongInput() {
      this.badInput = false;
    },
    containsInput() {
      this.existsInput = false;
    },
    removeValidation(id) {
      var name = this.tests[this.selectedTest].name;
      fetch(
        `${process.env.VUE_APP_TC_API}/tests/` +
          name +
          "/exercises/" +
          this.selectedExerciseIndex +
          "/validations/" +
          id,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          this.tests[this.selectedTest].exercises[
            this.selectedExercise
          ].validations.splice(parseInt(id), 1);
          this.loadTests();
        }
      });
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
