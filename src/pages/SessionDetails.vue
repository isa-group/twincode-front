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
              'Send email',
            ]"
            :body="participants"
            :actions="[
              { eventName: 'rejoin', icon: reloadIconUrl, key: 'socketId' },
              { eventName: 'delete', icon: deleteIconUrl, key: 'code' },
              { eventName: 'sendEmail', icon: emailIconUrl, key: 'mail' },
            ]"
            :invisible="['socketId']"
            @delete="deleteUser($event)"
            @rejoin="rejoinUser($event)"
            @sendEmail="sendEmail($event)"
          />
          <p class="mt-3 font-bold">
            Total: {{ this.participants.length }} participants.
          </p>
          <button 
            class="mt-3 mr-3 rounded-full bg-orange-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            @click="showImportModal = true">
            Import from CSV
          </button>
          <button
            class="mt-3 mr-3 rounded-full bg-green-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            @click="exportParticipants()"
            v-if="this.participants.length > 0"
          >
            Export participants
          </button>
          <button 
            class="mt-3 mr-3 rounded-full bg-blue-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            @click="sendEmailAll()"
            v-if="this.participants.length > 0"
          >
            Send emails
          </button>
          <button
            class="mt-3 mr-3 rounded-full bg-purple-400 p-2 px-5 focus:outline-none focus:shadow-outline"
            @click="addBot()"
          >
            Add Bot
          </button>
        </div>
        <Modal v-model="showImportModal" title="Import Users">
          <div class="mb-5">
            <b class="mb-5">
              Please upload a .CSV file with the following information: <b style="color:rgb(78, 109, 138)">&#10;name,surname,email,gender,birthday,studyStartYear</b>
            </b>
          </div>
          <div class="mb-5">
            <p class="mb-5">
              &#8226; The first line of the file must contain specified headers in the same order.
            </p>
          </div>
          <div class="mb-5">
            <p class="mb-5">
              &#8226; The Birthday format: <b>YYYY-MM-DD</b>
            </p>
          </div>
          <div class="mb-5">
              <p class="mb-5">
                &#8226; Known languages format: <b>language1;language2;language3;</b>
              </p>
          </div>
          <div class="mb-5">
            <p class="mb-5">
              &#8226; Gender: <b>"Male"</b> or <b>"Female"</b>
            </p>
          </div>
          <div class="mb-5">
            <p class="mb-5">
              &#8226; File encoding: <b>UTF-8</b>
            </p>
          </div>
            <input
              v-on:change="importCsv($event)"
              type="file"
              accept=".csv"
              class="border rounded-sm ml-2 p-1"
            />
            <template v-slot:footer>
              <button
                @click="downloadCsv()"
                class="px-4 bg-transparent p-3 rounded-lg hover:bg-gray-300 mr-2 focus:outline-none focus:shadow-outline text-blue-500"
              >
                Download example
              </button>
            </template>
            <template v-slot:actionButtons>
              <button
                @click="importUsers()"
                class="px-4 bg-transparent p-3 rounded-lg bg-green-400 hover:bg-green-300 mr-2 focus:outline-none focus:shadow-outline"
              >
                Upload
              </button>
            </template>
        </Modal>
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
            @click="showDeleteModal = true"
          >
            Delete session
          </button>
        </div>
        <div class="fixed h-full w-full top-0 left-0 flex items-center justify-center"
          style="backdrop-filter: blur(2px); backdrop-filter: brightness(50%);"
          v-if="showDeleteModal"
          >
          <div class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5">
            <h1 class="text-2xl font-semibold mb-5 align-self-xl-center">Delete session</h1>
            <p class="mb-5">
              Are you sure you want to delete this session? <b style="color:red">This action cannot
              be undone.</b>
            </p>
            <b class="mb-5">
              Please type the name of the session to confirm:
            </b>
            <input
            v-model="sessionToDelete"
            type="text"
            class="border rounded-sm ml-2 p-1"
            />
            <div class="flex justify-end mt-5">
              <button
                @click="sessionToDelete = ''; showDeleteModal = false"
                class="px-4 bg-transparent p-3 rounded-lg hover:bg-gray-100 hover:text-orange-400 mr-2 focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              
              <button
                @click="deleteSession()"
                v-if="sessionToDelete === this.session.name"
                class="px-4 bg-transparent p-3 rounded-lg bg-orange-400 hover:bg-orange-300 mr-2 focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="fixed h-full w-full top-0 left-0 flex items-center justify-center"
          @wheel.prevent
          @scroll.prevent
          @touchmove.prevent
          style="backdrop-filter: blur(2px); backdrop-filter: brightness(50%);"
          v-if="showPopUp"
          >
          <div class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5" style="width: 40%;">
            <h1 class="text-2xl font-semibold mb-5 align-self-xl-center">{{ popUpTitle }}</h1>
            <p class="mb-5" v-html="popUpMessage">
            </p>
            <div class="flex justify-end mt-5">
              <button
                @click="closePopUp()"
                class="px-4 bg-transparent p-3 rounded-lg hover:bg-gray-100 hover:text-orange-400 mr-2 focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <!-- <Modal v-model="showDeleteModal" title="Delete session">
            <p class="mb-5">
              Are you sure you want to delete this session? <b style="color:red">This action cannot
              be undone.</b>
            </p>
            <b class="mb-5">
              Please type the name of the session to confirm:
            </b>
            <input
              v-model="sessionToDelete"
              type="text"
              class="border rounded-sm ml-2 p-1"
            />
            <template v-slot:actionButtons v-if="sessionToDelete === this.session.name">
              <button
                @click="deleteSession()"
                class="px-4 bg-transparent p-3 rounded-lg bg-orange-400 hover:bg-orange-300 mr-2 focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </template>
        </Modal> -->
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
import emailIcon from "@/assets/icons/email.png";
import Modal from "../components/Modal";

export default {
  components: {
    Header,
    Table,
    ToggleSwitch,
    Modal,
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
      emailIconUrl: emailIcon,
      waitingStartResponse: false,
      showDeleteModal: false,
      showImportModal: false,
      csvFile: null,
      sessionToDelete: "",
      showPopUp: false,
      popUpTitle: "",
      popUpMessage: "",
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
    closePopUp() {
      this.showPopUp = false;
      this.popUpMessage = "";
      this.popUpTitle = "";
    },
    importCsv(event) {
      this.csvFile = event.target.files[0];
    },
    downloadCsv() {
      const link = document.createElement("a");
      link.href = "/csv/example-users-twincode.csv";
      link.setAttribute("download", "example-users-twincode.csv");
      link.click();
    },
    exportParticipants() {
      fetch(
        `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/export`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        if (response.status == 200) {
          return response.json();
          
        } else {
          this.popUpMessage = "There was an error exporting the participants. Try again later.";
          this.popUpTitle = "Error";
          this.showPopUp = true;
        }
      }).then((response) => {
        const filename = this.session.name + "-participants.csv";
        const data = this.$papa.unparse(response);

        const element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:text/csv;charset=utf-8," + encodeURIComponent(data)
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      })
      ;
    },
    importUsers() {
      if (this.csvFile) {
        const users = [];
        const subject = this.$route.params.sessionName;
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const allLines = result.split(/\r\n|\n/).filter(line => line.trim() != "");
          const headers = allLines[0].split(",");
          const expectedHeaders = ["name","surname","email","gender","birthday","studyStartYear"];
          if (headers.length != expectedHeaders.length) {
            this.popUpMessage = "The headers do not match the expected headers. Check the csv file and try again.";
            this.popUpTitle = "Error";
            this.showPopUp = true;
            return;
          } else {
            for (let i = 0; i < headers.length; i++) {
              if (headers[i] != expectedHeaders[i]) {
                this.popUpMessage = "The headers do not match the expected headers. Your colum: " + headers[i] + " Expected column: " + expectedHeaders[i] + ". Check the csv file and try again.";
                this.popUpTitle = "Error";
                this.showPopUp = true;
                return;
              }
            }
          }
          try {
            for (let i = 1; i < allLines.length; i++) {
              const user = {};
              const values = allLines[i].split(",");
              for (let j = 0; j < values.length; j++) {
                if(j == 4) {
                  //check if date is valid
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  const date = new Date(values[j]);
                  if(date instanceof Date && !isNaN(date) && dateRegex.test(values[j])) {
                    user[headers[j]] = values[j];
                  } else {
                    this.popUpMessage = "The date " + values[j] + " is not valid. Check the csv file and try again.";
                    this.popUpTitle = "Error";
                    this.showPopUp = true;
                    return;
                  }
                } else if (j == 5) {
                  user[headers[j]] = parseInt(values[j]);
                } else if (j == 2) {
                  // Check if email is valid
                  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                  if (emailRegex.test(values[j])) {
                    user[headers[j]] = values[j];
                  } else {
                    this.popUpMessage = "The email " + values[j] + " is not valid. Check the csv file and try again.";
                    this.popUpTitle = "Error";
                    this.showPopUp = true;
                    return;
                  }
                } else if( j == 3) {
                  if(["Male","Female"].includes(values[j])) {
                    user[headers[j]] = values[j];
                  } else {
                    this.popUpMessage = "Gender value " + values[j] + " is not valid. Check the csv file and try again.";
                    this.popUpTitle = "Error";
                    this.showPopUp = true;
                    return;
                  }
                } else {
                  user[headers[j]] = values[j];
                }
              }
              user["shown_gender"] = user.gender;
              user["subject"] = subject;
              users.push(user);
            }
          } catch (error) {
            this.popUpMessage = "There was an error parsing the csv file. Check the csv file and try again.";
            this.popUpTitle = "Error";
            this.showPopUp = true;
            return;
          }
          if(users.length == 0) {
            this.popUpMessage = "There are no users in the csv file. Check the csv file and try again.";
            this.popUpTitle = "Error";
            this.showPopUp = true;
            return;
          }
          fetch(`${process.env.VUE_APP_TC_API}/participants/${subject}/import`, {
            method: "POST",
            body: JSON.stringify(users),
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.adminSecret,
            },
          }).then((response) => {
            if (response.status == 200) {
              response.json().then((response) => {
                this.showImportModal = false;
                this.loadParticipants();
                if(response.errors > 0) {
                  this.popUpMessage = `<div><div><b style="color:green">${response.success}</b> participants imported successfully!</div><div><b style="color:red">${response.errors}</b> participants not imported due to errors.</div><div><b style="color:blue">${response.exists}</b> already existing participants.</div><div style="margin-top: 10px;"><b>Errors ocurred:</b><p>Please try again, if errors persist contact the development team...</p></div></div>`;
                } else {
                  this.popUpMessage = `<div><b style="color:green">${response.success}</b> participants imported successfully!</div><div><b style="color:blue">${response.exists}</b> already existing participants.</div>`;
                }
                this.popUpTitle = "Import results";
                this.showPopUp = true;
              });
            } else {
              this.popUpMessage = "There was an error importing the users. Check the csv file and try again.";
              this.popUpTitle = "Error";
              this.showPopUp = true;
            }
          });
        }
        reader.readAsText(this.csvFile);
      } else {
        this.popUpMessage = "Please select a valid csv file.";
        this.popUpTitle = "Error";
        this.showPopUp = true;
      }
    },
    goBack() {
      this.$router.push({
        path: `/administration`,
      });
    },
    deleteUser(userCode) {
      var r = confirm(
        "You are going to remove the participant with email " +
          userCode +
          ". This action cannot be undone. Are you sure?"
      );
      if (r) {
        fetch(
          `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/${userCode}`,
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
    sendEmail(userEmail) {
      fetch(
        `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/${userEmail}/send`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.popUpMessage = "Email sent successfully!";
          this.popUpTitle = "Success";
          this.showPopUp = true;
        } else {
          this.popUpMessage = "There was an error sending the email. Try again later.";
          this.popUpTitle = "Error";
          this.showPopUp = true;
        }
      });
    },
    sendEmailAll() {
      this.popUpMessage = "Emails are being sent to all users, please wait..."
      this.popUpTitle = "Sending in process..."
      this.showPopUp = true;
      fetch(
        `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/send`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      ).then((response) => {
        this.closePopUp()
        if (response.status == 200) {
          response.json().then((response) => {
            if (response.errors>0) {
              this.popUpTitle = "Emails partially sent..."
              this.popUpMessage = `<div><div><b style="color:green">${response.success}</b> emails sent successfully!</div><div><b style="color:red">${response.errors}</b> emails not sent because of errors.</div><div style="margin-top: 10px;"><b>Errors ocurred:</b><p>You can send an email to especific participants or you can try again. If errors persist please contact the development team...</p></div></div>`;
              this.showPopUp = true;
            } else {
              this.popUpTitle = "Emails sent successfully!"
              this.popUpMessage = `<div><div><b style="color:green">${response.success}</b> emails sent successfully!</div></div>`;
              this.showPopUp = true;
            }
          })
        } else {
          this.popUpMessage = "An error ocurred while sending emails, try again. If error persists, comunicate with the development team.";
          this.popUpTitle = "Error";
          this.showPopUp = true;
        }
      })
    },
    addBot() {
      fetch(
        `${process.env.VUE_APP_TC_API}/participants/${this.$route.params.sessionName}/BOT`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          this.popUpMessage = "Bot added successfully!";
          this.popUpTitle = "Success";
          this.showPopUp = true;
          this.loadParticipants();
        } else {
          this.popUpMessage = "There was an error adding the bot. Try again later.";
          this.popUpTitle = "Error";
          this.showPopUp = true;
        }
      });
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
            this.session.isStandard = retrievedSession.isStandard ?? true;
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
              orderedTest.totalTime = test.exercises[0].time;
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
          this.popUpMessage = "Session deleted successfully!";
          this.popUpTitle = "Success";
          this.showPopUp = true;
          this.$router.push({
            path: `/administration`,
          });
        } else {
          this.popUpMessage = "There was an error deleting the session. Try again later.";
          this.popUpTitle = "Error";
          this.showPopUp = true;
        }
      });
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
          this.popUpMessage = "Session updated successfully!";
          this.popUpTitle = "Success";
          this.showPopUp = true;
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
          this.popUpMessage = "Session is now " + (this.session.active ? "active!" : "inactive!");
          this.popUpTitle = this.session.active ? "Active" : "Inactive";
          this.showPopUp = true;
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

<style>

</style>
