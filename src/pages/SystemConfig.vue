<template>
    <div>
      <Header v-if="loggedIn"/>
      <div v-if="loggedIn && config" class="text-center">
        <div class="inline-block w-full max-w-screen-xl">
          <div class="text-left">
            <h1 class="p-5 text-2xl md:text-3xl md:ml-3 font-semibold">
              System Configuration
            </h1>
          </div>
          <div class="p-5">
            <div class="mb-4">
                <p><strong>Last modified:</strong> {{ config.modified }}</p>
                <p><strong>Environment:</strong> {{ config.environment }}</p>
            </div>
            <div class="mb-4">
                <label for="language" class="block text-left mb-2">Language: </label>
                <select id="language" v-model="config.language" class="block w-full p-2 border rounded">
                    <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
                </select>
            </div>
            <div class="flex justify-between mt-4">
                <button @click="goBack" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Go back
                </button>
                <button @click="updateConfig" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Update
                </button>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 320px; margin-left: auto; margin-right: auto; margin-top: 200px;" class="typewriter" v-if="!loggedIn || !config">
        <h1>Sorry! This page is not available</h1>
      </div>
    </div>
  </template>
  
  <script>
  import Header from "../components/Header";
  
  export default {
    data() {
      return {
        loggedIn: false,
        secret: null,
        error: false,
        config: null,
        languages: []
      };
    },
    components: {
      Header,
    },
    created() {
      document.body.classList.add("bg-gray-800");
      this.getConfig();
    },
    methods: {
      getConfig() {
        fetch(`${process.env.VUE_APP_TC_API}/systemconfig`, {
          method: "GET",
          headers: {
            Authorization: localStorage.adminSecret,
          },
        })
          .then((response) => {
            if (response.status == 200) {
              this.loggedIn = true;
              document.body.classList.remove("bg-gray-800");
            }
            return response.json();
          })
          .then((data) => {
            this.config = data.config;
            this.languages = data.languages;
          });
      },
      updateConfig() {
        if (this.config?.language) {
            fetch(`${process.env.VUE_APP_TC_API}/systemconfig`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.adminSecret,
                },
                body: JSON.stringify({
                    language: this.config.language
                })
            })
            .then((response) => {
                if (response.status == 200) {
                    this.success = "Configuration updated successfully";
                    console.log(this.success)
                    this.getConfig();
                } else {
                    this.error = "Error while updating the configuration..."
                    console.log(this.error)
                }
            })
        }
      },
      goBack() {
        this.$router.go(-1);
      }
    },
  };
  </script>
  
  <style>
  </style>