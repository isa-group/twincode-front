<template>
    <div class="bg-gray-200 h-screen font-sans">
        <div v-if="validCredentials" 
            class="fixed h-full w-full top-0 z-50 flex justify-center items-center"
            style="backdrop-filter: blur(2px);"
        >
            <div class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-lg m-5 w-2/3" >
                <h1 class="font-bold text-2xl mb-4">Reconnecting</h1>
                <p class="font-medium">Please wait while we try to reconnect...</p>
            </div>
        </div>
      <div class="container mx-auto h-full flex justify-center items-center">
        <div class="w-1/3">
          <div class="text-center">
            <h1 class="mb-6 text-center font-hairline text-3xl inline-block">
              Reconnec to the session
            </h1>
            <img
              class="w-56 mb-3 ml-2 inline-block"
              src="@/assets/tc_color.png"
            />
          </div>
          <div
            class="border-teal-600 p-8 border-t-8 bg-white mb-6 rounded-md shadow-md"
          >
            <div
              v-if="invalidCredentials"
              class="bg-red-200 border-red-300 border mb-6 rounded"
            >
              <p class="text-red-800 text-sm p-2">Wrong token</p>
            </div>
            <form @submit.prevent="onSubmit">
              <div class="mb-6">
                <label class="font-bold text-grey-800 block mb-2">Session token</label>
                <input
                  ref="tokenInput"
                  type="text"
                  v-model="token"
                  class="block appearance-none w-full bg-white border border-gray-200 hover:border-grey px-2 py-2 rounded shadow"
                  placeholder="Enter the session token to reconnect"
                />
              </div>
  
              <div class="flex items-center justify-between">
                <button
                  type="submit"
                  class="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded"
                >
                  Reconnect
                </button>
              </div>
            </form>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
        invalidCredentials: false,
        validCredentials: false,
        token: "",
      };
    },
    methods: {
      async onSubmit() {
        try {
            const response = await fetch(process.env.VUE_APP_TC_API + "/registerUser", {
                method: "POST",
                body: JSON.stringify({
                tokenId: this.token,
                code: this.$route.params.code,
                }),
                headers: {
                "Content-Type": "application/json",
                },
            }).then((response) => {
                return response;
            });
            if(response.status == 200 ) {
                this.validCredentials = true;
                
                const storageData = await fetch(process.env.VUE_APP_TC_API+"/storage?code="+this.$route.params.code,
                    {
                    method: "GET",
                    }
                ).then((response) => {
                    return response.json();
                })
                if (storageData.error || !storageData) {
                    console.log("Error getting storage data, no storage data...");
                    return;
                }
                console.log("Storage data: "+JSON.stringify(storageData));
                localStorage.setItem("user", JSON.stringify(storageData.user));
                localStorage.setItem("pairedTo", storageData.pairedTo);
                
                this.$router.go(-1);
                
            } else {
                this.invalidCredentials = true;
            }
              
        } catch(e) {
        console.log("Error getting storage data ",e);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(250, 73, 73, 0.7);
    -moz-box-shadow: 0px 0px 5px 0px rgba(250, 73, 73, 0.7);
    box-shadow: 0px 0px 5px 0px rgba(250, 73, 73, 0.7);
    border-color: rgb(250, 91, 73);
  }
  
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
  
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
  
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
  
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  </style>