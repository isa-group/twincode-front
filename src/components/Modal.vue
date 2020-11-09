<template>
  <div
    class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center"
  >
    <div
      class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
    ></div>

    <div
      class="modal-container bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
    >
      <!--<div
        class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
      >
        <svg
          class="fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
          ></path>
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>-->

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">{{ title }}</p>
          <div class="modal-close cursor-pointer z-50" @click="closeModal()">
            <svg
              class="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              ></path>
            </svg>
          </div>
        </div>

        <!--Body-->
        <slot></slot>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button
            class="px-4 bg-transparent p-3 rounded-lg hover:bg-gray-100 hover:text-orange-400 mr-2 focus:outline-none focus:shadow-outline"
            @click="closeModal()"
          >
            {{ cancelTitle }}
          </button>
          <slot name="actionButtons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: String,
    cancelTitle: {
      type: String,
      default: "Cancel",
    },
  },
  methods: {
    toggleModal() {
      const body = document.querySelector("body");
      const modal = document.querySelector(".modal");
      modal.classList.toggle("opacity-0");
      modal.classList.toggle("pointer-events-none");
      body.classList.toggle("modal-active");
    },
    closeModal() {
      console.log("Closing");
      this.$emit("input", false);
    },
  },
  watch: {
    value() {
      this.toggleModal();
    },
  },
};
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
body.modal-active {
  height: 100%;
  overflow: hidden;
}
</style>
