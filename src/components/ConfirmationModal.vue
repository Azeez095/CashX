<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 text-center w-96">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-around">
        <button @click="onCancel" class="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
        <button @click="onConfirm" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
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
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style scoped>

</style>
