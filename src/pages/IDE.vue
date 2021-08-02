<template>
  <div class="container h-screen mx-auto">
    <div class="h-full">
      <div class="w-2/3 p-2 mx-auto">
        <img
          class="w-56 mb-3 mt-3 ml-2 inline-block"
          src="@/assets/tc_color.png"
        />
        <div class="p-3 mb-5 font-semibold text-lg">
          Start playing with code right here!
        </div>
        <div
          class="rounded-md border-solid border-8 border-gray-400 "
          @keyup.ctrl.83="validate"
        >
          <codemirror
            ref="cmEditor"
            v-model="code"
            id="codemirror"
            :options="cmOption"
            :events="['inputRead', 'change']"
          ></codemirror>
        <pre style="visibility: hidden;" id="codePre">{{code}}</pre>
        <pre style="visibility: hidden;" id="listInputs">{{inputs}}</pre>
        </div>
        <div
          v-if="returnValue"
          class="flex bg-green-200 p-3 mt-5 rounded-md border text-gray-800"
        >
          <p class="mt-1 text-black-900">Value returned: {{ returnValue }}</p>
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
          v-if="errored"
          class="flex bg-red-200 p-3 mt-5  rounded-md border text-gray-800"
        >
          <p class="mt-1 text-red-900">{{ errorMessage }}</p>
          <div class="flex-grow text-right">
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

        <div class="mt-5">
          <button
            class="bg-orange-600 hover:bg-orange-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
            @click="validate()"
          >
            Run program (CTRL-S)
          </button>
        </div>

        <div class="mt-5">
          <button
            class="bg-orange-600 hover:bg-orange-500 p-3 text-white shadow-md focus:outline-none focus:shadow-outline m-1"
            @click="validPython()"
          >
            Execute python
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code: `println("hola!")\nreturn 1;`,
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        mode: "text/javascript",
      },
      errored: false,
      errorMessage: "",
      returnValue: null,
      println: window.println,
      logs: window.logs,
      inputs: [1,2,3,4],
      solutions: [1,4,9,16],
    };
  },
  methods: {
    validate(e) {
      if (e) {
        console.log("preventing");
        e.preventDefault();
      }
      this.clearResult();
      try {
        let ret = this.evaluateCode(this.code);
        if (ret) {
            this.returnValue = ret;
        } else {
            this.errored = true;
            this.errorMessage = "You have to return some value";
        }
      } catch (e) {
        this.errored = true;
        this.errorMessage = e;
      }
    },
    evaluateCode(code) {
      return Function('"use strict";' + code)();
    },
    clearResult() {
      this.returnValue = null;
      this.errored = false;
      this.errorMessage = "";
      window.logs = [];
      this.logs = window.logs;
    },
    validPython() {
      document.getElementById("brythonButton").click();
      console.log(this.solutions+"          "+document.getElementById("resultsToValidate").innerHTML);

      if(document.getElementById("resultsToValidate").innerHTML == this.solutions+"") {
        document.getElementById("resultsToValidate").innerHTML = "Your answer is correct!"
        document.getElementById("resultsToValidate").style = "visibility: visible; background-color: hsla(89, 43%, 51%, 0.3); border-radius: 7px; color: green; padding: 5px; margin-top: 7px";
      } else {
        document.getElementById("resultsToValidate").innerHTML = "Your answer is not correct"
        document.getElementById("resultsToValidate").style = "visibility: visible; background-color: hsla(0, 100%, 51%, 0.3); border-radius: 7px; color: red; padding: 5px; margin-top: 7px";
      }
      /*Example:
      outputs = []
      for i in inputs:
        outputs.append(i*i)
      */
    },
  },
  computed: {
    cmEditor() {
      return this.$refs.cmEditor.codemirror;
    },
  },
  mounted() {
    console.log("the codemirror instance object", this.cm);
    document.getElementsByTagName("body")[0].classList += "bg-gray-200";
    
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
  },
};
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: 50vh !important;
}
</style>
