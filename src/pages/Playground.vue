<template>
  <div>
    <Onboard :steps="steps" :options="options"/>
    <div id="mainscreen" class="container h-screen mx-auto" v-if="!finished">
      <!--<div class="shadow w-full bg-grey-light h-3">
        <div
          ref="timeBar"
          class="bg-green-500 text-xs leading-none py-1 text-center text-white h-3"
          style="transition: 1s; width: 100%;"
        ></div>
      </div>-->
      <div v-if="exerciseType == 'DEMO'" >
          <div class="m-3 p-1 bg-yellow-200 border border-yellow-700 rounded-sm">
            <a class="ml-2 text-sm text-yellow-900 underline cursor-pointer" @click="exitDemo()">Click here to end the demo.</a>
          </div>
      </div>
      <div id="header" class="h-15 w-full bg-gray-900 flex content-center items-center justify-between">
          <div id="introbox">
            <a  class="cta" @click="seeInstructions()">
              <span class="spanning"> Instructions  </span>
              <span class="spaning">
                <svg width="47px" height="48px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path class="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                    <path class="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                    <path class="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
                  </g>
                </svg>
              </span> 
            </a>
          </div>
          <img id="twincode2"
            src="@/assets/tc_white_color.png"
            class="w-20 md:w-48 md:float-left inline md:mr-20 "
          />
          <h1 class="inline md:float-right md:mr-10 text-white font-thin text-sm md:text-xl order-last">
            Your Login ID: {{ token }}
          </h1> 
        </div> 
      
      <div id="interact" class="flex h-full flex-wrap">
        <div id="functbox" v-html="exerciseDescription"></div>
        <div id="codingbox">
              <!-- TIME REMAINING: --> 
              <div id="timerbox">
                  <h2 class="msgbox font-bold text-xl text-black-600">
                      Session Countdown:
                  </h2>
                  <h2 class="msgbox font-bold text-xl text-green-600">
                      {{ (maxTime - timePassed) | secondsToString }}
                  </h2>
                  <div id="timebarbox" class="shadow w-full bg-grey-light h-2"> 
                    <div 
                      ref="timeBar"
                      class="bg-green-600 text-4xl leading-none py-1 text-center text-white h-3"
                      style="transition: 1s; width: 70%; height:25px;"
                    >
                    </div>
                  </div>
                
              </div>

              <!-- CODE EDITOR: -->          
              <div style="height: 60vh; border-style: ridge;" @keyup.ctrl.83="validate">
                <div
                  ref="pairCursor"
                  id="pairCursor"
                  class="absolute bg-yellow-500 hidden"
                ></div>
                <br/>
                <pre><p class="text-purple-800 inline">{{text1codemirror}}</p>{{text2codemirror}}</pre>
                <codemirror
                  ref="cmEditor"
                  v-model="code"
                  id="codemirror"
                  :options="cmOption"
                  :events="['inputRead', 'change']"
                ></codemirror>
                <pre>     <p class="text-pink-700 inline">return</p> {{text3codemirror}}</pre>
              </div>

              <!-- RUN CODE BUTTONS: -->
             <div class="mt-2">
                    <!--<button
                        class="bg-yellow-800 hover:bg-yellow-700 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                        onClick="toggleControlMode();"
                      >
                        Give control
                      </button>-->
                    <button class="bg-teal-600 hover:bg-teal-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                      @click="validate()"
                      v-if="language == 'javascript' && canSubmit"
                    >
                      Run Code!
                    </button>
                  <button id="runcode"
                      class="bg-orange-600 hover:bg-orange-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                      @click="validatePython()"
                      v-if="language == 'python' && canSubmit"
                    > Run Code!
                  </button>
                  <!--
                  <button
                    class="bg-purple-600 hover:bg-orange-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                    @click="changeExercise()"
                    v-if="standardSession && exerciseType == 'PAIR'"
                  >
                    Change Exercise
                  </button>
                  -->
                  </div>
                  
          <!-- CASE 1: AUTOGRADER TESTS PASSING: --> 
          <div id="greentestsbox">
            <div v-if="isExerciseCorrect == true" class="flex bg-green-200 p-3 mt-5 rounded-md border text-gray-800">
              <b> Autograder Results: </b>
              <p class="mt-1 text-black-900">
                      {{ tot }} test cases: {{ numCorrect }} tests passed. {{ numWrong }} tests failed.
                    </p>
            <!-- configured David's API:
              <p class="mt-1 text-black-900">
                You got it right! Value returned: {{ returnValue }} <br/> 
              </p> 
              -->
              <p v-if="language == 'javascript'">
                <br>Quality Score: <strong>{{ twcc }}</strong> (the lower the better)
              </p>
              <p class="mt-1 text-green-900">
                      <pre>Congratulations! You got it all right! </pre>
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
          </div>

          <!-- CASE 2: AUTOGRADER TESTS FAILING: --> 
          <div id="testsbox">
            <div v-if="isExerciseCorrect === false"
              class="bg-red-200 p-3 rounded-md border text-gray-800 relative"
            >
              <!--<p v-if="returnValue != 'Something wrong with the code'">Sorry, this is not the right solution. Try again!</p> 
              <p class="mt-1 text-red-900">
                Value returned: {{ excerciseErrorMessage || returnValue }}
              </p> -->
              <b> Autograder Results: </b>
                    <p class="mt-1 text-black-900">
                      {{ tot }} test cases: {{ numCorrect }} tests passed. {{ numWrong }} tests failed. The rest errored or didn't run.
                    </p>
                    <p class="mt-1 text-red-900">
                      <pre>{{printValue}} </pre>
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
          </div>

          <div id="outputbox">
            <div v-if="returnValue && language == 'javascript'" class="p-3 bg-black text-white mt-2 rounded-md">
              <p>Your console log:</p>
              <p class="mt-1 text-black-900" v-for="log in logs" :key="log">
                <pre>$> {{ log }} </pre>
              </p>
            </div>
            <div v-if="returnValue && language == 'python'" class="p-3 bg-black text-white mt-2 rounded-md"> 
                      <p> <b> Running Tests: </b></p>
                      <p class="mt-1 text-black-900">
                        <pre>{{consoleValue }} </pre>
                      </p>
                    </div>
          </div>
          <div id="clearbox">
                  <div v-if="returnValue" class="mt-2">
                    <button id="clearbutton" type="button" class="bg-orange-500" @click="clearResult()"> Clear  
                  </button>
                  </div>
                  <!--<button
                      class="bg-yellow-800 hover:bg-yellow-700 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
                      onClick="toggleControlMode();"
                    >
                      Give control
                    </button>-->
                  
                  
                  
                
                </div>


          <div id="return"></div>
          <div id="result"></div>
        </div>
        <!-- CHATTING SECTION - RIGHT PANEL-->
        <div id="chatbox" class="h-full p-2">
          <div class="bg-gray-200 h-full p-1 flex flex-col-reverse">
            <div class="order-4 h-2/6">
              <img class="w-10 inline" src="@/assets/chat.png" />
              
              <p v-if="exerciseType == 'PAIR' & (this.testIndex == 2)" id="chattingbox" class="text-lg inline pl-3 mt-2 text-teal-900">
                    Your partner {{pronounOpp}} is connected:
                    </p>
                    <p v-if="exerciseType == 'PAIR' & (this.testIndex == 0)" id="chattingbox" class="text-lg inline pl-3 mt-2 text-teal-900">
                    Your partner {{pronounReal}} is connected:
                    </p>
                    <p v-if="exerciseType != 'PAIR'" class="text-lg inline pl-3 mt-2 text-teal-900">
                    Chat is disabled for the solo session.
                    </p>           
            </div>
            <div v-if="exerciseType != 'PAIR'" class="text-lg inline pl-3 mt-2 text-teal-900">
              <p></p> 
              </div>

            <div 
              class="flex-grow p-3 order-2 h-3/6 overflow-auto w-full"
              ref="messageContainer"
            ></div>

            <div id="typingbox" class="p-3 order-1 h-1/6">
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







    <div v-if="finished"
      class="container mx-auto h-screen flex justify-center items-center"
    >
      <div class="max-w-lg">
        <h1 class="mb-6 text-center font-hairline text-3xl">
          Thank you!
        </h1>
        <div
          class="bg-teal-100 border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5"
        >
          <h1 class="font-bold text-2xl mb-4">The programming sessions are over.</h1>
          <p class="font-medium" v-html="finishMessage">
          </p>
        </div>
        <div class="text-center">
          <p class="text-grey-dark text-sm inline">
            Universidad de Seville 
          </p>
          <p class="text-grey-dark text-sm inline font-hairline mr-1 ml-1">|</p>
          <p class="text-grey-dark text-sm inline">
            University of California, Berkeley 
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="starting && (standardSession == true && testCounter != 3 || standardSession == false)"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px);"
    >
      <img src="@/assets/tc_color.png" class="w-48" />
    </div>
    
    <div v-if="loadingTest && (standardSession == true && testCounter != 3 || standardSession == false)"
      class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
      style="backdrop-filter: blur(2px);"
    >
      <div
        class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5 w-2/3"
        v-if="standardSession == true && testCounter != 3 || standardSession == false"
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
import "codemirror/mode/python/python.js";
//import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";
import Onboard from "../components/Onboard";

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
    Onboard
  },
  data() {
    return {
      code: "# Replace the line below: \nout = inp",
      cmOption: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        mode: "text/x-python",
      },
      options: {
        useKeyboardNavigation: true,
        enabledButtons: {
          buttonSkip: true
        },
        labels: {
          buttonStop: 'Exit Guide',
          buttonPrevious: 'Back',
          buttonNext: 'Next',
          buttonSkip: 'Exit Guide',
        },

      },
      steps: [
          {
            target: "#introbox",  
            header: { title: 'Welcome to Twincode!'},
            content: `Use your key arrows to step through this quick quide.`,
            params: {
              placement: 'right' ,
              enableScrolling: false,
              highlight: true
            }
          },
          {
            target: "#chatbox",
            header: { title: 'Your Coding Partner'},
            content: 'Use the chat window to communicate with your partner and work together. \
            <br>You will be paired with a a different person for each session (or work solo).',
            params: {
              placement: 'left' ,
              enableScrolling: false,
              highlight: true,
            }
          },
          { // step 1
            target: "#timebarbox",
            header: { title: 'Time Remaining in the session'},
            content: '<p> Solve as many exercises as you can. You will move to a new exercise when you pass all tests.',
            
            params: {
              placement: 'bottom' ,
              highlight: true,
              enableScrolling: false,
            }
          },
          { // STEP 4
            target: "#codemirror",
            header: { title: 'Shared Code Editor'},
            content: 'Collaboratively edit code on the IDE.',
            params: {
              placement: 'right' ,
              enableScrolling: false,
              highlight: true,
            }
          },
          { // STEP 5
            target: "#runcode",
            header: { title: 'Running Code'},
            content: 'Click here to run tests, and scroll down see how many tests failed and the expected values.',
            params: {
              placement: 'right' ,
              enableScrolling: false,
              highlight: true,
            }          
          },
          { // STEP 9
            target: "#functbox",
            header: { title: 'Problem Description'},
            content: 'See input and output types and an example here. Your code takes in <code>inp</code> and should assign a value to <code>out</code>.',
            params: {
              placement: 'right' ,
            }
          }
        ],
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
      hasExerciseErrors: null,
      twcc:null,
      excerciseErrorMessage: "",
      returnValue: "",
      token: localStorage.getItem("code"),
      pronounReal: (JSON.parse(localStorage.getItem("user")).blind)? "" : (localStorage.getItem("pairedTo") === 'Female')? '(she/her)':'(he/him)',
      pronounOpp: (JSON.parse(localStorage.getItem("user")).blind)? "" : (localStorage.getItem("pairedTo") === 'Female')? '(he/him)':'(she/her)',
      printValue: "", /** NEW */
      numCorrect:null, /** NEW */
      numWrong: null, /** NEW */
      println: window.println,
      logs: window.logs,
      inputs: null,
      solutions: null,
      peerSocketId: null,
      language: "",
      updateCodeEventActive: true,
      text1codemirror: "",
      text2codemirror: "",
      text3codemirror: "",
      consoleValue: "",
      standardSession: false,
      testIndex: 0,
      testCounter: 0,
      canSubmit: true
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
      this.standardSession = pack.data.isStandard;
      localStorage.sessionIsStandard = pack.data.isStandard;
      localStorage.testCounterS = pack.data.testCounterS; 
      this.testCounter = pack.data.testCounterS; 
      this.canSubmit = true;
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
      this.hasExerciseErrors = null;
      this.$refs.timeBar.style.width = "100%";
      this.$refs.timeBar.classList.remove("bg-red-500");
      this.$refs.timeBar.classList.add("bg-green-500");
      this.exerciseDescription = pack.data.exerciseDescription;
      this.exerciseType = pack.data.exerciseType;
      this.maxTime = pack.data.maxTime;
      this.inputs = pack.data.inputs;
      this.solutions = pack.data.solutions;
      this.language = pack.data.testLanguage.toLowerCase();
      this.testIndex = pack.data.testIndex;
      if(this.language == "python") {
        this.text1codemirror = "def ";
        this.text2codemirror = "main(inp):";
        this.text3codemirror = "out";
      } else {
        this.text1codemirror = "function ";
        this.text2codemirror = "main(input) {";
        this.text3codemirror = "output;\n}";
      }
      this.clearResult();

      dbg("method changeExercise - init - Emiting event changeExercise with exercisedCharged: true");
      this.$socket.client.emit("changeExercise", {code: localStorage.code, exercisedCharged: true});
    },
    customAlert(pack) {
      var el = document.createElement("div");
      el.setAttribute("style","position:absolute;top:30%;left:40%;width: 20%;height: 20%; font-weight: bold; font-size: large; text-align: center;background-color: white; border-radius: 15px;line-height: 650%; box-shadow: 0px 0px 10px #666;");
      el.innerHTML = pack.data.message;
      if (pack.data.message == "There are no more exercises left on this test") {
        this.canSubmit = false;
      } else {
        this.canSubmit = true;
      }
      setTimeout(function(){
        el.parentNode.removeChild(el);
      }, 3000);
      document.body.appendChild(el);

      dbg("method customAlert - init ");
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
    changeExercise() {
      dbg("method changeExercise - init - Emiting event changeExercise with exercisedCharged: false");
      this.$socket.client.emit("changeExercise", {code: localStorage.code, exercisedCharged: false});
    },
    newMessage(msg, mine) {
      dbg("method newMessage - init",msg);
      const MessageClass = Vue.extend(Message);
      let gender = localStorage.getItem("pairedTo") === 'Female';
      gender = (this.testIndex == 2) ? !gender : gender;
      gender = JSON.parse(localStorage.getItem("user")).blind ? null : gender; 
      const msgInstance = new MessageClass({
        propsData: {
          mine: mine,
          message: msg,
          girl: gender, // if true -- gets woman avatar, if false --gets man avatar, if null --no avatar
        },
      });

      msgInstance.$mount();
      this.$refs.messageContainer.appendChild(msgInstance.$el);

      var container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
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
        this.hasExerciseErrors = true;
        this.excerciseErrorMessage = e;
        console.log("ERROR HERE: ", e);
      }
    },
    validatePython() {
     var codeToSend = "" + this.$refs.cmEditor.codemirror.getValue();
     this.consoleValue = "";
     this.returnValue = "";
     this.printValue = "";
     this.numCorrect = null; /** NEW */
     this.numWrong = null;
     this.tot = null;
     this.isExerciseCorrect = null;
     fetch("https://asliakalin.pythonanywhere.com/tester", {
          method: "POST",
          body: JSON.stringify({
            inputs: this.inputs,
            solutions: this.solutions,
            code: codeToSend
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(response => response.json()).then(data => {
              console.log("Data returned from tester:\n"+JSON.stringify(this.returnValue,null,2));
              this.isExerciseCorrect = data.result;
              
              this.consoleValue = data.console;
              this.returnValue = data.solution;
              this.consoleValue = data.console;
              this.returnValue = data.solution;
              this.printValue = data.prints;
              this.numCorrect = data.correct;
              this.numWrong = data.wrong;
              this.tot = data.tot;
              //this.hasExerciseErrors = data.errors;
              
              
              if (this.isExerciseCorrect == true) {
                dbg("validatePython - Correct Exercise - Changing Exercise...");
                console.log("Valid exercise.");

                setTimeout(() => { this.changeExercise(); }, 2000);
              }else{
                 console.log("Invalid exercise.");
              }
              
        });
    },
    seeInstructions() {
      this.$tours["myTour"].start();
    },
    clearResult() {
      dbg("method clearResult - init");
      this.isExerciseCorrect = null;
        this.hasExerciseErrors = null;
      this.excerciseErrorMessage  = "";
      this.returnValue = "";
      this.errorMessage = "";
      window.logs = [];
      this.logs = window.logs;
    },
    valid(v) {
      dbg("method valid - init",v);
      if (this.exerciseType != 'DEMO') {
        console.log(v);
        fetch(process.env.VUE_APP_TC_API + "/verify", {
          method: "POST",
          body: JSON.stringify({
            exerciseDescription: this.exerciseDescription,
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
              this.numCorrect = data.numCorrect; /** NEW */
              this.numWrong = data.numWrong;
              this.tot = data.tot;
              
              if (this.isExerciseCorrect == true) {
                dbg("validateJavascript - Correct Exercise - Chhanging Exercise...");
                setTimeout(() => { this.changeExercise(); }, 2000);
              }
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
  border: 1px solid, rgb(8,8,8);
  height: 60vh !important;
  font-size:13px;
}
#pairCursor {
  width: 2px;
  height: 19px;
  z-index: 9999;
}
#runcode {
  margin-bottom: 2%;
}

.action_btn {
  width: 200px;
  margin: 0 auto;
  display: inline-block;
}

#clearbutton {
  transition-duration: 0.4s;
  color: white;
  padding: 5px 10px;
  border: 2px solid #5f5f5f;
  width: 15%;
  float: right;
  border-radius: 8px;
  margin-bottom:5%;
}

#clearbutton:hover {
  background-color: white;
  color:black; 
}

#twincode2 {
  width: 28%;
  display: inline;
  float: right;
}
#functbox{
  position: absolute;
  top:0;
  left:0.5%;
  margin:0;
  height: fit-content;
  min-height: 87vh;
  width: 28%;
  padding: 6px;
}
#demobutton {
  display: inline-block;
  transition-duration: 0.4s;
  background-color: #dddcdc; 
  color: black;
  padding: 1%;
  border: 2px solid #5f5f5f;
  border-radius: 4px;
  margin:1em;
  cursor: pointer;

}

#demobutton:hover {
  background-color: white; 
  box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 6px 8px 0 rgba(0,0,0,0.19);
}

#demobutton:active {
  background-color: #a1a1a1;
  box-shadow: 0 3px #666;
  transform: translateY(4px);
}
#introbox{
  display: inline;
  justify-content: center;
  float: left;
  align-items: bottom;
  margin: 0.8% 1% 1% 3%;
}

#timebarbox:hover {
   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.603);
}
.msgbox {
  display: inline-block;
  padding-right: 1%;
}
#timerbox {
  display: inline;
  margin: 0 1% 0 1%;
}
#collabing {
  display: block;
}
#timebarbox {
  height: 25px;
  margin-bottom: 4px;
  margin-top: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.603);
  display: inline-block;
}

#chatbox {
  position: absolute;
  min-height: 87vh;
  width:26.5%;
  overflow-y:auto;
  border-radius: 3px;
  background-color:  #f7fafc;
  margin:0;
  left:73%;
  top:0;
  padding: 0px;
}
/** Text above chat window "Your partner (he/she) is connected*/
#chattingbox { 
  margin-left:0px;
  padding-left:0px;
  vertical-align: middle;
}

#codingbox{
  position: absolute;
  width:42.5%;
  font-size: 95%;
  top:0;
  left:29.5%;
  margin:0;
}

#id {
  background-color: lightskyblue;
  border-radius: 3px;
  padding: 5px;
  margin-top: 10px;
}

#token {
  display: inline-block;
  color:black;
  padding-left:5px;
}
 
a:link {
  color: white;
  background-color: green;
  padding: 3px;
  text-decoration: none;
}

pre {
  white-space: pre-wrap;
}

#interact {
  font-size: 85%;
  flex-wrap: wrap;
  width: inherit;
  justify-content: center;
  position:relative;
  margin-top: 8px;
  height: fit-content;
}
/**
a:visited {
  color: purple;
  background-color: lightgoldenrodyellow;
  text-decoration: none;
} 
a:hover {
  color: gainsboro;
  background-color: rgb(251, 255, 23);
  padding: 1px;
  text-decoration: underline;
}
a:active {
  color: black;
  background-color: greenyellow;
  padding: 2px;
  text-decoration: underline;
} */
@import url('https://fonts.googleapis.com/css?family=Poppins:900i');

* {
  box-sizing: border-box;
}

.cta {
    display: flex;
    padding: 2px 22px;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-size: 28px;
    color: white;
    background: #6225E6;
    transition: 1s;
    box-shadow: 6px 6px 0 black;
    transform: skewX(-15deg);
    margin-bottom:7px;
    
}

.cta:focus {
   outline: none; 
}

.cta:hover {
    transition: 0.5s;
    box-shadow: 10px 10px 0 #FBC638;
    cursor: pointer;
}

.cta .spaning:nth-child(2) {
    transition: 0.5s;
    margin-right: 0px;
}

.cta:hover  .spanning:nth-child(2) {
    transition: 0.5s;
    margin-right: 45px;
}

  .spanning {
    transform: skewX(15deg) 
  }

  .spanning:nth-child(2) {
    width: 20px;
    margin-left: 30px;
    position: relative;
    top: 12%;
  }
  
/**************SVG****************/

path.one {
    transition: 0.4s;
    transform: translateX(-60%);
}

path.two {
    transition: 0.5s;
    transform: translateX(-30%);
}

.cta:hover path.three {
    animation: color_anim 1s infinite 0.2s;
}

.cta:hover path.one {
    transform: translateX(0%);
    animation: color_anim 1s infinite 0.6s;
}

.cta:hover path.two {
    transform: translateX(0%);
    animation: color_anim 1s infinite 0.4s;
}

/* SVG animations */

@keyframes color_anim {
    0% {
        fill: white;
    }
    50% {
        fill: #FBC638;
    }
    100% {
        fill: white;
    }
}
</style>
