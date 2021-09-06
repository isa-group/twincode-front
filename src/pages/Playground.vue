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
      <div v-if="exerciseType == 'DEMO'" >
          <div class="m-3 p-1 bg-yellow-200 border border-yellow-700 rounded-sm">
            <a class="ml-2 text-sm text-yellow-900 underline cursor-pointer" @click="exitDemo()">Click here to end the demo.</a>
          </div>
      </div>
      <div class="flex h-full flex-wrap">
        <div class="w-2/3 p-2">
          <div>{{ (maxTime - timePassed) | secondsToString }}</div>
          <div v-html="exerciseDescription"></div>
          <div style="height: 70vh;" @keyup.ctrl.83="validate" >
            <div
              ref="pairCursor"
              id="pairCursor"
              class="absolute bg-yellow-500 hidden"
            ></div>
            <br/>
            <pre><p class="text-purple-800 inline">function</p> main(input) {</pre>
            <codemirror
              ref="cmEditor"
              v-model="code"
              id="codemirror"
              :options="cmOption"
              :events="['inputRead', 'change']"
            ></codemirror>
        <pre style="visibility: hidden;" id="codePre">{{code}}</pre>
        <pre style="visibility: hidden;" id="listInputs">{{inputs}}</pre>
            <pre>     <p class="text-pink-700 inline">return</p> output;</pre>
            <pre>}</pre>
            <br/>
          </div>
          <div
            v-if="isExerciseCorrect"
            class="flex bg-green-200 p-3 mt-5 rounded-md border text-gray-800"
          >
            <p class="mt-1 text-black-900">
              You got it right! Value returned: {{ returnValue }} <br/> Quality Score: <strong>{{ twcc }}</strong> (the lower the better)
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
        <pre style="visibility: hidden;" id="resultsToValidate"></pre>

          <div class="mt-2" style="bottom: 5px;">
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
              Validate in js
            </button>

          <button
            class="bg-orange-600 hover:bg-orange-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
            @click="validPython()"
          >
            Validate in python
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
          <p class="font-medium" v-html="finishMessage">
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
        <p class="font-medium" v-html="testDescription"></p>
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

function dbg(msg, obj, fields) {
  
  function replacer(key, value) {
    const originalObject = this[key];
    if(originalObject instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(originalObject.entries()), 
      };
    } else {
      return value;
    }
  }

  if(obj){
    if(fields && Array.isArray(fields)){
      var logObj = {};
      for (const field in obj) {
        if(fields.includes(field))
          logObj[field] = obj[field];
      }       
      console.log("DEBUG - "+msg+" <"+JSON.stringify(logObj,replacer).slice(0, -1)+",...}>"); 
    }else{
      console.log("DEBUG - "+msg+" <"+JSON.stringify(obj,replacer)+">");
    }

  } else{
      console.log("DEBUG - "+msg);
  }

}

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
      twcc:null,
      excerciseErrorMessage: "",
      returnValue: "",
      token: localStorage.getItem("code"),
      println: window.println,
      logs: window.logs,
      inputs: null,
      solutions: [1,4,9,16],
      peerSocketId: null,
      updateCodeEventActive: true
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
      dbg("EVENT msg",pack);
      if (pack.uid != this.uid && pack.rid == this.rid) {
        console.log(
          "newMsg event triggered with data <" + this.toJSON(pack) + "> "
        );
        this.newMessage(pack.data, false);
      }
    },
    refreshCode(pack) {
      dbg("EVENT refreshCode",pack);

      // Too expensive Debug log
      //console.log("text event triggered with data <" + this.toJSON(pack) + "> ");

      this.$refs.cmEditor.codemirror.replaceRange(
        pack.change.text,
        pack.change.from,
        pack.change.to,
        "server"
      );
     
    },
    finish() {
      dbg("EVENT finish");
      console.log("EVENT finish trigered!");
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
          this.$socket.client.emit("clientFinished", {token: localStorage.token, code: localStorage.code});
        });
    },
    loadTest(pack) {
      dbg("EVENT loadTest",pack);
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
      dbg("EVENT cursorActivity",data);      
      this.cursorLeftPosition = data.left;
      this.cursorTopPosition = data.top;
      this.updateCursorLocation();
    },
    newExercise(pack) {
      dbg("EVENT newExercise",pack);  

      this.loadingTest = false;
      this.starting = false;
      this.timePassed = 0;
      this.isExerciseCorrect = null;
      this.$refs.timeBar.style.width = "100%";
      this.$refs.timeBar.classList.remove("bg-red-500");
      this.$refs.timeBar.classList.add("bg-green-500");
      this.exerciseDescription = pack.data.exerciseDescription;
      this.exerciseType = pack.data.exerciseType;
      this.maxTime = pack.data.maxTime;
      this.inputs = pack.data.inputs;
      this.clearResult();
    },
    reconnect() {
      dbg("EVENT reconnect");
      this.$socket.client.emit("clientReconnection", localStorage.token);
    },
    countDown(pack) {
      //dbg("EVENT countDown",pack);
      this.timePassed = this.maxTime - pack.data;
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
    requestBulkCodeEvent(peerSocketId){
      dbg("EVENT requestBulkCodeEvent");
      var currentCode =  this.$refs.cmEditor.codemirror.getValue();
      dbg("EVENT requestBulkCodeEvent - code : \""+currentCode+"\"");
      if(this.peerSocketId != peerSocketId){
        this.peerSocketId = peerSocketId;
        this.$socket.client.emit("bulkCode", this.pack({
          peerSocketId:peerSocketId, 
          code: currentCode
        }));

      }else{
        dbg("EVENT requestBulkCodeEvent - IGNORED because peerSocketId didn't changed");
      }
    },
    bulkCodeUpdate(code){
      dbg("EVENT bulkCodeUpdate",code);
      var currentCode =  this.$refs.cmEditor.codemirror.getValue();
      console.log
      if(currentCode != code){
        this.updateCodeEventActive = false;
        this.$refs.cmEditor.codemirror.setValue(code);
        this.updateCodeEventActive = true;

      }
    }
  },
  created() {
    dbg("created - init");
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
      dbg("method sendMessage - init",this.myMessage);
      if (this.exerciseType == "PAIR") {
        this.newMessage(this.myMessage, true);
        this.$socket.client.emit("msg", this.pack(this.myMessage));

        this.myMessage = "";
      }
    },
    newMessage(msg, mine) {
      dbg("method newMessage - init",msg);
      const MessageClass = Vue.extend(Message);
      let gender = localStorage.getItem("pairedTo") === 'Female';
      gender = this.peerChange ? !gender : gender;
      gender = JSON.parse(localStorage.getItem("user")).blind ? null : gender;
      const msgInstance = new MessageClass({
        propsData: {
          mine: mine,
          message: msg,
          girl: gender,
        },
      });

      msgInstance.$mount();
      this.$refs.messageContainer.appendChild(msgInstance.$el);

      var container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    },
    validPython() {
      document.getElementById("brythonButton").click();
      //console.log(this.solutions+"          "+document.getElementById("resultsToValidate").innerHTML);

      var solutionsCompiled = document.getElementById("resultsToValidate").innerHTML;

      /*
      if(document.getElementById("resultsToValidate").innerHTML == this.solutions+"") {
        document.getElementById("resultsToValidate").innerHTML = "Your answer is correct!"
        document.getElementById("resultsToValidate").style = "visibility: visible; background-color: hsla(89, 43%, 51%, 0.3); border-radius: 7px; color: green; padding: 5px; margin-top: 7px";
      } else {
        document.getElementById("resultsToValidate").innerHTML = "Your answer is not correct"
        document.getElementById("resultsToValidate").style = "visibility: visible; background-color: hsla(0, 100%, 51%, 0.3); border-radius: 7px; color: red; padding: 5px; margin-top: 7px";
      }
      */
      try {
        var toValidate = [];
        //console.log(solutionsCompiled.split(","));
        for(var s = 0; s < solutionsCompiled.split(",").length; s++) {
          var t = solutionsCompiled.split(",")[s];
          //console.log(t);

          var sol = Number(t); 
          if (isNaN(sol)) {
            sol = t.toLowerCase();
            var sol2 = (sol == 'true' || sol == 'false');
            if (sol2 == false) {
              sol = t;
            } else {
              sol = t.toLowerCase() == 'true';
            }
          }
          toValidate.push(sol);
        }
        //console.log(toValidate);
        this.valid(toValidate);
      } catch (e) {
        this.isExerciseCorrect = false;
        this.excerciseErrorMessage = e;
        console.log("ERROR HERE: ", e);
      }
      /*Example:
      outputs = []
      for i in inputs:
        outputs.append(i*i)
      */
    },
    validate() {
      dbg("method validate - init",this.code);
      this.clearResult();
      try {
        var solutions = [];

        this.inputs.forEach(input => {
          solutions.push(eval("var input="+JSON.stringify(input)+";" + this.code + "; output;"));
        });

        console.log("Inputs: "+JSON.stringify(this.inputs));
        console.log("Outputs: "+JSON.stringify(solutions));
        
        console.log(solutions);

        this.valid(solutions);

        /*if (ret) {
          this.valid(ret);
        } else {
          this.isExerciseCorrect = false;
          this.excerciseErrorMessage = "You should return the solution.";
        }*/
      } catch (e) {
        this.isExerciseCorrect = false;
        this.excerciseErrorMessage = e;
        console.log("ERROR HERE: ", e);
      }
    },
    clearResult() {
      dbg("method clearResult - init");
      this.isExerciseCorrect = null;
      this.excerciseErrorMessage  = "";
      this.returnValue = "";
      this.errorMessage = "";
      window.logs = [];
      this.logs = window.logs;
    },
    valid(v) {
      dbg("method valid - init",v);
      if (this.exerciseType != 'DEMO') {
        fetch(process.env.VUE_APP_TC_API + "/verify", {
          method: "POST",
          body: JSON.stringify({
            solutions: v,
            user: localStorage.token,
            source: "function main(input) { "+
                        this.$refs.cmEditor.codemirror.getValue()+
                        "return output;"+
                    "}"
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.status == 200) {
            response.json().then((data) => {
              this.isExerciseCorrect = data.result;
              this.twcc = data.twcc;
              this.returnValue = v;
            });
          }
        });
      } else {
        this.isExerciseCorrect = JSON.parse(localStorage.demoExercise).solution === v;
        this.returnValue = v;
      }
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
    exitDemo() {
      dbg("method exitDemo - init");
      clearInterval(this.timeInterval);
      this.$router.go(-1);
    },
    loadDemoExercise() {
      dbg("method loadDemoExercise - init");
      const demoExercise = JSON.parse(localStorage.demoExercise);
      this.starting = false;
      this.maxTime = demoExercise.time;
      this.exerciseDescription = demoExercise.description;
      this.exerciseType = "DEMO"
      this.timeInterval = setInterval(() => {
        this.timePassed++;
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
        if (this.timePassed > this.maxTime) {
          clearInterval(this.timeInterval);
        }
      },1000);
    },
    pack(data) {
      dbg("method pack - init",data);
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
      eval(code);
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
      if(this.updateCodeEventActive)
        this.$socket.client.emit("updateCode", c);
    },
    cursorActivity(doc) {
      dbg("method cursorActivity - init");
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
        if(this.updateCodeEventActive)
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
    dbg("mounted - init");

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

    this.$refs.timeBar.style.width = `${((this.maxTime - this.timePassed) /
      this.maxTime) *
      100}%`;

    if (localStorage.demoExercise) {
      this.loadDemoExercise();
    }
  },
  beforeDestroy() {
    dbg("beforeDestroy - init");
    window.removeEventListener("resize", this.handleScroll);
    const elemento = document.getElementsByClassName("CodeMirror-scroll")[0];
    if (elemento) {
      elemento.removeEventListener("scroll", this.handleScroll);
    }
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
