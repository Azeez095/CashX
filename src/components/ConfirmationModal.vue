<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 text-center w-96">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-around">
        <!-- Cancel Button -->
        <button
          @click="onCancel"
          class="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          :disabled="loading"
        >
          Cancel
        </button>

        <!-- Delete Button -->
        <button
          @click="onConfirm"
          class="bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <!-- Spinner when loading -->
          <div v-if="loading" class="flex items-center">
            <span
              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
              <span class="sr-only">Loading...</span>
            </span>
            <span class="ml-2">Deleting</span>
          </div>
          <!-- Normal text when not loading -->
          <div v-else>Delete</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  loading: Boolean, // New prop for the loading state
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style scoped></style>
