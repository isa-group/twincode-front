<template>
  <div class="bg-orange-200 font-sans">
    <div class="container mx-auto h-full flex justify-center">
        <div v-if="!submitionOk" class="w-full lg:w-2/3 p-3">
        <img class="w-full md:w-2/3 p-3 mb-3" src="@/assets/tc_color.png"/>
        <div class="mb-3 ml-3">
        <h1 class="text-4xl inline ml-0" style="font-family: 'Comic Sans MS', 'Comic Sans', 'Comic Neue'; font-weight: bold; color: #F50016;">
        &lt;</h1>
        <h1 class="ml-0 mr-0 text-4xl inline font-thin">
          Signup
        </h1>
        <h1 class="text-4xl inline" style="font-family: 'Comic Sans MS', 'Comic Sans', 'Comic Neue'; font-weight: bold; color: #F50016;">>
        </h1>
      </div>
        <div
          class="border-orange-400 p-8 border-t-8 bg-white mb-3 rounded-md shadow-lg"
        >
          <form @submit.prevent="checkForm">
            <div class="mb-4">
              <label class="font-bold text-grey-800 block mb-2"
                >First Name <span class="text-red-600">*</span></label
              >
              <input
                type="text"
                v-model="details.firstName"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Your name"
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-grey-800 block mb-2"
                >Surname <span class="text-red-600">*</span></label
              >
              <input
                type="text"
                v-model="details.surname"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Your surname/s"
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Email <span class="text-red-600">*</span></label
              >
              <input
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="details.mail"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Your personal email"
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Academic email<span class="text-red-600"></span></label
              >
              <input
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                v-model="details.academicMail"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="In case is different from your personal email"
              />
            </div>
            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Session <span class="text-red-600">*</span></label
              >
              <input
                type="text"
                v-model="details.subject"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="This code should have been provided to you by the organizers."
              />
              <p v-if="sessionStatus.canJoin != null && !sessionStatus.canJoin" class="ml-3 mt-2 text-sm text-red-700">{{sessionStatus.message}}</p>
              <p v-if="sessionStatus.canJoin != null && sessionStatus.canJoin" class="ml-3 mt-2 text-sm text-green-700">Session found!</p>

            </div>


            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Number of subjects this year
                <span class="text-red-600">*</span></label
              >
              <input
                type="number"
                v-model="details.numberOfSubjects"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Number of subjects in the current course."
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Year of first enrollement <span class="text-red-600"
                  >*</span
                ></label
              >
              <input
                type="number"
                v-model="details.beganStudying"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="The year on which you began studying your current degree"
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Programming languages you know <span class="text-red-600"
                  >*</span
                ></label
              >
              <input
                type="text"
                v-model="details.knownLanguages"
                pattern="([a-zA-Z\+#]+)(,\s*[a-zA-Z\+#]+)*"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Only a-z and commas are allowed. No whitespaces."
              />
            </div>

            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Experience with JavaScript<span class="text-red-600">*</span></label
              >
              <input
                type="radio"
                id="jsexp1"
                value="1"
                v-model="details.jsexp"
                class="mr-1"
              />
              <label for="jsexp1">Very Low</label>
              <br />
              <input
                type="radio"
                id="jsexp2"
                value="2"
                v-model="details.jsexp"
                class="mr-1"
              />
              <label for="jsexp2">Low</label>
              <br />
              <input
                type="radio"
                id="jsexp3"
                value="3"
                v-model="details.jsexp"
                class="mr-1"
              />
              <label for="jsexp3">Medium</label>
              <br />
              <input
                type="radio"
                id="jsexp4"
                value="4"
                v-model="details.jsexp"
                class="mr-1"
              />
              <label for="jsexp4">High</label>
              <br />
              <input
                type="radio"
                id="jsexp5"
                value="5"
                v-model="details.jsexp"
                class="mr-1"
              />
              <label for="jsexp5">Very High</label>
              <br />
            </div>



            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Gender <span class="text-red-600">*</span></label
              >
              <input
                type="radio"
                id="maleGender"
                value="Male"
                v-model="details.gender"
                class="mr-1"
              />
              <label for="maleGender">Male</label>
              <br />
              <input
                type="radio"
                id="femaleGender"
                value="Female"
                class="mr-1"
                v-model="details.gender"
              />
              <label for="femaleGender">Female</label>
              <br />
              <input
                type="radio"
                id="otherGender"
                value="true"
                class="mr-1"
                v-model="otherGenderSelected"
                @click="selectOtherGender"
              />
              <label for="otherGender">Other</label>
              <transition name="fade">
              <input
                v-if="details.gender !== 'Male' && details.gender !== 'Female' && details.gender != null"
                type="text"
                id="otherGenderText"
                v-model="details.gender"
                class="block mt-2 appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="Enter the gender that better describes yourself."
              />
              </transition>
            </div>


            <div class="mb-4">
              <label class="font-bold text-gray-800 block mb-2"
                >Date of birth <span class="text-red-600">*</span></label
              >
              <input
                type="date"
                v-model="details.birthDate"
                class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                placeholder="dd/mm/yyyy"
              />
            </div>

            <div class="mb-4">
              <label class="text-gray-700">
                <input type="checkbox" required /> I accept to participate in
                the study knowing that all the personal data I provide will
                be kept confidential and will not be publicly available but
                some aggregated and annonimized data could be analyzed for
                research purposes.</label
              >
            </div>

            <div class="flex items-center justify-between mt-10">
              <button
                type="submit"
                class="bg-orange-500 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded"
              >
                Sign up
              </button>
            </div>
            <div
              v-if="errors.length"
                class="bg-red-200 border-red-300 border mt-6 mb-3 rounded"
              >
              <p class="text-red-800 text-sm p-2">
                <b>Please correct the following error(s):</b>
                <ul class="mb-3">
                  <li class="text-red-800 text-sm pl-2 font-light" :key="error" v-for="error in errors"> - {{ error }}</li>
                </ul>
              </p>
              </div>
          </form>
        </div>
        <div class="mb-6 ml-3">
        <h1 class="text-4xl inline ml-0" style="font-family: 'Comic Sans MS', 'Comic Sans', 'Comic Neue'; font-weight: bold; color: #F50016;">
          &lt;&#47;</h1>
          <h1 class="ml-0 mr-0 text-4xl inline font-thin">
            Signup
          </h1>
          <h1 class="text-4xl inline" style="font-family: 'Comic Sans MS', 'Comic Sans', 'Comic Neue'; font-weight: bold; color: #F50016;">>
          </h1>
        </div>
        <div class="text-center pb-5">
          <p class="text-grey-dark text-sm inline">
            Universidad de Sevilla
          </p>
          <p class="text-grey-dark text-sm inline font-hairline mr-1 ml-1">|</p>
          <p class="text-grey-dark text-sm inline">
            University of California, Berkeley
          </p>
        </div>
      </div>
      <div v-if="submitionOk" class="w-full h-screen lg:w-2/3 p-3">
        <img class="w-full md:w-2/3 p-3 mb-3" src="@/assets/tc_color.png"/>
        <div>
          <div
            class="bg-teal-100 border-teal-600 p-8 border-t-8 mb-6 rounded-md shadow-lg m-5"
          >
          <h1 class="font-bold text-2xl mb-4">Thanks for participating!</h1>
          <p class="font-medium" v-html="registrationText"> </p>
          </div>
          <div class="text-center">
            <p class="text-grey-dark text-sm inline">
              Universidad de Sevilla
            </p>
            <p class="text-grey-dark text-sm inline font-hairline mr-1 ml-1">|</p>
            <p class="text-grey-dark text-sm inline">
              University of California, Berkeley
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
    return {
      errors: [],
      invalidCredentials: false,
      details: {
        firstName: "",
        surname: "",
        mail: "",
        academicMail: "",
        gender: null,
        jsexp: null,
        birthDate: null,
        subject: "",
        beganStudying: null,
        numberOfSubjects: null,
        knownLanguages: "",
      },
      submitionOk: false,
      registrationText: "",
      otherGenderSelected: false,
      sessionStatus: {
        canJoin: null,
        message: ""
      }
    };
  },
  methods: {
    checkForm(e) {
      if (
        this.details.firstName &&
        this.details.surname &&
        this.details.mail &&
        this.details.gender &&
        this.details.jsexp &&
        this.details.birthDate &&
        this.details.subject &&
        this.details.beganStudying &&
        this.details.numberOfSubjects &&
        this.details.knownLanguages &&
        this.dateValid()
      ) {
        this.errors = [];
        return this.onSubmit();
      }

      this.errors = [];

      if (!this.details.firstName) {
        this.errors.push("First name required.");
      }
      if (!this.details.surname) {
        this.errors.push("Surname required.");
      }
      if (!this.details.mail) {
        this.errors.push("Mail required.");
      }
      if (!this.details.gender) {
        this.errors.push("Gender required.");
      }
      if (!this.details.jsexp) {
        this.errors.push("Experience with JavaScript required.");
      }
      if (!this.details.birthDate) {
        this.errors.push("Date of birth required.");
      }
      if (!this.details.subject) {
        this.errors.push("Subject required.");
      }
      if (!this.details.beganStudying) {
        this.errors.push("Year of first enrollement required.");
      }
      if (!this.details.numberOfSubjects) {
        this.errors.push("Number of subjects this year required.");
      }
      if (!this.details.knownLanguages) {
        this.errors.push("Known languages is required.");
      }

      e.preventDefault();
    },
    onSubmit() {
      fetch(process.env.VUE_APP_TC_API + "/signup", {
        method: "POST",
        body: JSON.stringify(this.details),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status === 200) {
          this.submitionOk = true;
          return response.json();
        } else if (response.status === 400) {
          this.submitionOk = false;
          return response.json();
        } else {
          this.errors.push("There was an unexpected error.");
        }
      }).then((data) => {
        if (this.submitionOk) {
          this.registrationText = data.registrationText;
        } else {
          if (data.code === "DUPLICATE") {
            this.errors.push("You already registered in the session. Please check you inbox or spam folder.");
          } else {
            this.errors.push("Error in the request. Please check the form.");
          }
          
        }
      });
    },
    dateValid() {
      // Because <input type="date" /> behaves differently in safari
      // This check is necesary
      const date = new Date(this.details.birthDate);
      if (date == "Invalid Date") {
        // Safari
        let dateArray = this.details.birthDate.split("/");
        this.details.birthDate = new Date(
          `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
        );
        console.log(this.details.birthDate);
      } else {
        this.details.birthDate = date;
      }

      if (this.details.birthDate == "Invalid Date") {
        this.errors.push("Please enter a valid date in your birth date.");
      }

      return this.details.birthDate != "Invalid Date";
    },
    selectOtherGender() {
      this.details.gender = "";
      this.otherGenderSelected = true;
    }
  },
  watch: {
    'details.gender': function(newVal) {
      if (newVal == "Male" || newVal == "Female") {
        this.otherGenderSelected = false;
      }
    },
    'details.subject': function(newVal) {
      if (newVal != "") {
        fetch(process.env.VUE_APP_TC_API + "/status/" + newVal, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
          },
        }).then((response) => {
          return response.json()
        }).then((data) => {
          if (data.exists && data.active && !data.running) {
            this.sessionStatus.canJoin = true;
          } else {
            this.sessionStatus.canJoin = false;
            if (!data.exists) {
              this.sessionStatus.message = "This session doesn't exist."
            } else if (!data.active) {
              this.sessionStatus.message = "This session is not active yet."
            } else if (data.running) {
              this.sessionStatus.message = "This session is running. You cannot join it."
            }
          }
        });
      }
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
