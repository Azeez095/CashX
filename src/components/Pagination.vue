<template>
  <div class="pagination flex justify-center items-center gap-2 mt-4">
    <!-- Previous Button -->
    <button
      :disabled="currentPage === 1"
      @click="goToPreviousPage"
      class="pagination-btn"
    >
      Previous
    </button>

    <!-- Page Buttons -->
    <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="['pagination-btn', { active: currentPage === page }]"
    >
      {{ page }}
    </button>

    <!-- Next Button -->
    <button
      :disabled="currentPage === totalPages"
      @click="goToNextPage"
      class="pagination-btn"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Props
defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

// Emit event
const emit = defineEmits(["pageChange"]);

// Generate pages array dynamically
const pages = computed(() => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
});

// Change page functions
const changePage = (page) => {
  if (page >= 1 && page <= totalPages) {
    emit("pageChange", page);
  }
};

const goToPreviousPage = () => {
  if (currentPage > 1) changePage(currentPage - 1);
};

const goToNextPage = () => {
  if (currentPage < totalPages) changePage(currentPage + 1);
};
</script>

<style scoped>
.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.pagination-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  background-color: #e9ecef;
  color: #ccc;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0056b3;
  color: white;
}
</style>
