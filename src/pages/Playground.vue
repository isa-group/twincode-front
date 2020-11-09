<template>
  <div>
    <div class="container h-screen mx-auto" v-if="!finished">
      <div class="shadow w-full bg-grey-light h-3">
        <div
          ref="timeBar"
          class="bg-green-500 text-xs leading-none py-1 text-center text-white h-3"
          style="transition: 1s; width: 100%;"
        ></div>
      </div>
      <div class="flex h-full flex-wrap">
        <div class="w-2/3 p-2">
          <div>{{ (maxTime - timePassed) | secondsToString }}</div>
          <div>{{ exerciseDescription }}</div>
          <div style="height: 60vh;" @keyup.ctrl.83="validate" >
            <div
              ref="pairCursor"
              id="pairCursor"
              class="absolute bg-yellow-500 hidden"
            ></div>
            <codemirror
              ref="cmEditor"
              v-model="code"
              id="codemirror"
              :options="cmOption"
              :events="['inputRead', 'change']"
            ></codemirror>
          </div>
          <div
            v-if="isExerciseCorrect"
            class="flex bg-green-200 p-3 mt-5 rounded-md border text-gray-800"
          >
            <p class="mt-1 text-black-900">
              You got it right! Value returned: {{ returnValue }}
            </p>
            <div class="flex-grow text-right">
              <button @click="clearResult">
                <img
                  class="w-4"
                  src="https://img.icons8.com/small/32/000000/close-window.png"
                />
              </button>
            </div>
          </div>

          <div
            v-if="isExerciseCorrect === false"
            class="bg-red-200 p-3 rounded-md border text-gray-800 relative"
          >
            <p>Sorry, this is not the right solution. Try again!</p>
            <p class="mt-1 text-red-900">
              Value returned: {{ excerciseErrorMessage || returnValue }}
            </p>
            <div class="absolute top-0 right-0 mt-1 mr-1">
              <button @click="clearResult">
                <img
                  class="w-4"
                  src="https://img.icons8.com/small/32/000000/close-window.png"
                />
              </button>
            </div>
          </div>

          <div v-if="returnValue" class="p-3 bg-black text-white mt-2 rounded-md">
            <p>Your console log:</p>
            <p class="mt-1 text-black-900" v-for="log in logs" :key="log">
              <pre>$> {{ log }} </pre>
            </p>
          </div>

          <div class="mt-2">
            <!--<button
                class="bg-yellow-800 hover:bg-yellow-700 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                onClick="toggleControlMode();"
              >
                Give control
              </button>-->
            <button
              class="bg-teal-600 hover:bg-teal-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
              @click="validate()"
            >
              Validate (CTRL-S)
            </button>
          </div>
          <div id="return"></div>
          <div id="result"></div>
        </div>
        <div class="w-1/3 h-full p-2">
          <div class="bg-gray-100 h-full p-2 flex flex-col-reverse">
            <div class="order-4 h-2/6">
              <img class="w-12 inline" src="@/assets/chat.png" />
              <p class="text-2xl inline pl-3 mt-2 text-teal-900">
                Chat
              </p>
              <p class="p-3">This is a place to chat with your peer</p>
            </div>
            <div
              class="flex-grow p-3 order-2 h-3/6 overflow-auto w-full"
              ref="messageContainer"
            ></div>
            <div class="p-3 order-1 h-1/6">
              <textarea
                :disabled="exerciseType != 'PAIR'"
                v-model="myMessage"
                class="border resize-none w-full text-sm p-2"
                placeholder="Write message here and press ENTER"
                v-on:keyup.enter="sendMessage()"
              >
              </textarea>
              <p class="text-xs text-gray-600">
                Press ENTER to send Message
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="finished"
      class="container mx-auto h-screen flex justify-center items-center"
    >
      <div class="max-w-lg">
        <h1 class="mb-6 text-center font-hairline text-3xl">
          Session is over
        </h1>
        <div
          class="bg-teal-100 border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5"
        >
          <h1 class="font-bold text-2xl mb-4">Congratulations!</h1>
          <p class="font-medium">
            {{ finishMessage }}
          </p>
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
    <div
      v-if="starting"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px);"
    >
      <img src="@/assets/tc_color.png" class="w-48" />
    </div>
    <div
      v-if="loadingTest"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px);"
    >
      <div
        class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5 w-2/3"
      >
        <h1 class="font-bold text-2xl mb-4">A new test begins!</h1>
        <h2 class="font-bold text-xl text-gray-600">
          {{ (maxTime - timePassed) | secondsToString }}
        </h2>
        <p class="font-medium">{{ testDescription }}</p>
        <p class="font-normal mt-1">Your ID: {{ token }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Message from "../components/Message";
import { codemirror } from "vue-codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code: ``,
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        mode: "text/javascript",
      },
      firstLoad: true,
      awaiting: null,
      cursorLeftPosition: 0,
      cursorTopPosition: 0,
      myMessage: "",
      uid: "",
      rid: "",
      lastReceived: "",
      exerciseDescription: "Please, wait until the exercise loads...",
      exerciseLoaded: false,
      exerciseType: "PAIR",
      testDescription: "",
      finished: false,
      starting: true,
      loadingTest: false,
      peerChange: false,
      timeInterval: null,
      maxTime: 0,
      timePassed: 0,
      isExerciseCorrect: null,
      excerciseErrorMessage: "",
      returnValue: "",
      token: localStorage.getItem("code"),
      println: window.println,
      logs: window.logs,
    };
  },
  filters: {
    secondsToString: function(value) {
      const minutes = Math.floor(value / 60);
      const seconds = value - minutes * 60;

      return `${minutes}:${("0" + seconds).slice(-2)}`;
    },
  },
  sockets: {
    msg(pack) {
      if (pack.uid != this.uid && pack.rid == this.rid) {
        console.log(
          "newMsg event triggered with data <" + this.toJSON(pack) + "> "
        );
        this.newMessage(pack.data, false);
      }
    },
    refreshCode(pack) {
      console.log(
        "text event triggered with data <" + this.toJSON(pack) + "> "
      );
      this.$refs.cmEditor.codemirror.replaceRange(
        pack.change.text,
        pack.change.from,
        pack.change.to,
        "server"
      );
      /*if (pack.uid != this.uid && pack.rid == this.rid) {
        this.lastReceived = pack.data;
        this.code = pack.data;
        console.log("  --> Updating code!");
      } else {
        console.log("  --> Ignored!");
      }*/
    },
    finish() {
      fetch(
        process.env.VUE_APP_TC_API + "/finishMessage?code=" + localStorage.code,
        {
          method: "GET",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.finished = true;
          this.finishMessage = response.finishMessage;
        });
    },
    loadTest(pack) {
      this.finished = false;
      this.loadingTest = true;
      this.starting = false;
      this.testDescription = pack.data.testDescription;
      this.peerChange = pack.data.peerChange;
      this.$refs.messageContainer.innerHTML = "";
      this.code = "";
      this.clearResult();
    },
    cursorActivity(data) {
      this.cursorLeftPosition = data.left;
      this.cursorTopPosition = data.top;
      this.updateCursorLocation();
    },
    newExercise(pack) {
      this.loadingTest = false;
      this.starting = false;
      this.maxTime = pack.data.maxTime;
      this.timePassed = 0;
      this.isExerciseCorrect = null;
      this.$refs.timeBar.style.width = "100%";
      this.$refs.timeBar.classList.remove("bg-red-500");
      this.$refs.timeBar.classList.add("bg-green-500");
      this.exerciseDescription = pack.data.exerciseDescription;
      this.exerciseType = pack.data.exerciseType;
      this.clearResult();
    },
    reconnect() {
      this.$socket.client.emit("clientReconnection", localStorage.token);
    },
    countDown(pack) {
      this.timePassed = this.maxTime - pack.data;
      console.log("Counting down!");
      let factor = 100 / this.maxTime;
      let width = parseFloat(this.$refs.timeBar.style.width, 10) - factor;
      this.$refs.timeBar.style.width = width + "%";
      if (width < 20) {
        this.$refs.timeBar.classList.remove("bg-yellow-500");
        this.$refs.timeBar.classList.add("bg-red-500");
      } else if (width < 40) {
        this.$refs.timeBar.classList.remove("bg-green-500");
        this.$refs.timeBar.classList.add("bg-yellow-500");
      }
    },
  },
  created() {
    var pathParams = window.location.pathname.split("/");
    this.rid = pathParams[3] + ":" + pathParams[2];

    this.uid = new String(
      new Date().getTime() + new Date().getUTCMilliseconds()
    ).substr(8, 13);

    this.$socket.client.emit("clientReconnection", localStorage.token);
  },
  watch: {
    cursorTopPosition: function(val) {
      console.log(val);
    },
    cursorLeftPosition: function(val) {
      console.log(val);
    },
  },
  methods: {
    sendMessage() {
      if (this.exerciseType == "PAIR") {
        this.newMessage(this.myMessage, true);
        this.$socket.client.emit("msg", this.pack(this.myMessage));

        this.myMessage = "";
      }
    },
    newMessage(msg, mine) {
      const MessageClass = Vue.extend(Message);
      const msgInstance = new MessageClass({
        propsData: {
          mine: mine,
          message: msg,
          girl: this.peerChange,
        },
      });

      msgInstance.$mount();
      this.$refs.messageContainer.appendChild(msgInstance.$el);

      var container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
    validate() {
      this.clearResult();
      try {
        const ret = this.evaluateCode(this.code);
        if (ret) {
          this.valid(ret);
        } else {
          this.isExerciseCorrect = false;
          this.excerciseErrorMessage = "You should return the solution.";
        }
      } catch (e) {
        this.isExerciseCorrect = false;
        this.excerciseErrorMessage = e;
        console.log("ERROR HERE: ", e);
      }
    },
    clearResult() {
      this.isExerciseCorrect = null;
      this.excerciseErrorMessage  = "";
      this.returnValue = "";
      this.errorMessage = "";
      window.logs = [];
      this.logs = window.logs;
    },
    valid(v) {
      fetch(process.env.VUE_APP_TC_API + "/verify", {
        method: "POST",
        body: JSON.stringify({
          solution: v,
          user: Number(localStorage.token),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            this.isExerciseCorrect = data.result;
            this.returnValue = v;
          });
        }
      });
    },
    onCmBlur(cm) {
      console.log("cm blur!", cm);
    },
    onCmFocus(cm) {
      console.log("cm focus!", cm);
    },
    onCmReady(cm) {
      console.log("cm ready!", cm);
    },
    loadExercise() {
      this.onTimesUp();
      fetch("/test?code=" + localStorage.token, {
        method: "GET",
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            if (data.finished) {
              window.location.href = "/finished";
            } else {
              this.exerciseDescription = data.description;
              this.maxTime = data.time;
              this.startTimer();
            }
          });
        }
      });
    },
    pack(data) {
      return {
        rid: this.rid,
        uid: this.uid,
        token: localStorage.token,
        data: data,
      };
    },
    toJSON(obj) {
      return JSON.stringify(obj, null, 2);
    },
    evaluateCode(code) {
      return Function('"use strict";' + code)();
    },
    handleResize() {
      const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];
      const newLeft =
        document.getElementById("codemirror").getBoundingClientRect().left +
        this.cursorLeftPosition +
        30 -
        elemento.scrollLeft;
      document.getElementById("pairCursor").style.left = newLeft + "px";
    },
    handleScroll() {
      const cmWidth = document.getElementById("codemirror").offsetWidth;
      const cmHeight = document.getElementById("codemirror").offsetHeight + 19;

      const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];
      const newTop =
        document.getElementById("codemirror").getBoundingClientRect().top +
        this.cursorTopPosition +
        5 -
        elemento.scrollTop;

      const newLeft =
        document.getElementById("codemirror").getBoundingClientRect().left +
        this.cursorLeftPosition +
        30 -
        elemento.scrollLeft;
      if (cmWidth > newLeft) {
        this.$refs.pairCursor.style.left = newLeft + "px";
      }
      if (cmHeight > newTop) {
        this.$refs.pairCursor.style.top = newTop + "px";
      }

      console.log(elemento.scrollTop);
    },
    inputRead(i, c) {
      this.$socket.client.emit("updateCode", c);
    },
    cursorActivity(doc) {
      this.$socket.client.emit(
        "cursorActivity",
        doc.cursorCoords(false, "relative")
      );
    },
    onCmCodeChange(e, c) {
      const changeObj = {
        author: this.$socket.client.id,
        change: c,
      };
      if (c.origin != "server") {
        this.$socket.client.emit("updateCode", this.pack(changeObj));
      }
      this.firstLoad = false;
    },
    updateCursorLocation() {
      const cmWidth = document.getElementById("codemirror").offsetWidth;
      const cmHeight = document.getElementById("codemirror").offsetHeight;
      console.log(cmHeight);

      const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];

      const top =
        document.getElementById("codemirror").getBoundingClientRect().top +
        this.cursorTopPosition +
        5 -
        elemento.scrollTop;
      const left =
        document.getElementById("codemirror").getBoundingClientRect().left +
        this.cursorLeftPosition +
        30 -
        elemento.scrollLeft;
      console.log(top);
      console.log(cmHeight);
      if (cmWidth > left) {
        this.$refs.pairCursor.style.left = left + "px";
      }
      if (cmHeight > top) {
        this.$refs.pairCursor.style.top = top + "px";
      }
    },
  },
  computed: {
    cmEditor() {
      return this.$refs.cmEditor.codemirror;
    },
  },
  mounted() {
    this.$refs.cmEditor.codemirror.on("change", this.onCmCodeChange);
    this.$refs.cmEditor.codemirror.on("cursorActivity", this.cursorActivity);
    const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];
    elemento.addEventListener("scroll", this.handleScroll);

    // Cursor functionaliy disabled
    /*let toggle = true;
    setInterval(function() {
      if (toggle) {
        document.getElementById("pairCursor").classList.add("invisible");
      } else {
        document.getElementById("pairCursor").classList.remove("invisible");
      }
      toggle = !toggle;
    }, 750);*/

    // Disable ctrl+s shortkey in Windows or Linux
    document.body.addEventListener('keydown', event => {
     if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case "s":
          event.preventDefault();
          break;
      }
     }
    });

    console.log("the codemirror instance object", this.cm);
    //this.loadExercise();
    this.$refs.timeBar.style.width = `${((this.maxTime - this.timePassed) /
      this.maxTime) *
      100}%`;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleScroll);
    const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];
    elemento.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: 50vh !important;
}
#pairCursor {
  width: 2px;
  height: 19px;
  z-index: 9999;
}
</style>
